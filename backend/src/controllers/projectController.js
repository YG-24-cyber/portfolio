import prisma from '../config/prisma.js';
import { generateSlug, ensureUniqueProjectSlug } from '../utils/slug.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Format techStack to clean array of strings
 */
const normalizeTechStack = (techStack) => {
  if (Array.isArray(techStack)) {
    return techStack.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof techStack === 'string') {
    return techStack
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

/**
 * Get all projects with filtering and ordering
 * @route GET /api/projects
 * @access Public
 */
export const getProjects = async (req, res, next) => {
  try {
    const { search, category, status, featured } = req.query;

    const where = {};

    // Search filter across title, description, and techStack array
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { techStack: { has: term } },
      ];
    }

    // Category filter
    if (category && category.trim()) {
      where.category = { equals: category.trim(), mode: 'insensitive' };
    }

    // Status filter
    if (status && status.trim()) {
      const normalizedStatus = status.trim().toUpperCase();
      if (['ACTIVE', 'PRODUCTION'].includes(normalizedStatus)) {
        where.status = normalizedStatus;
      }
    }

    // Featured toggle filter
    if (featured !== undefined) {
      if (featured === 'true' || featured === true) {
        where.isFeatured = true;
      } else if (featured === 'false' || featured === false) {
        where.isFeatured = false;
      }
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return sendSuccess(res, 200, 'Projects retrieved successfully.', {
      projects,
      count: projects.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single project by slug or UUID
 * @route GET /api/projects/:slugOrId
 * @access Public
 */
export const getProjectBySlugOrId = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    if (!slugOrId) {
      return sendError(res, 400, 'Project slug or identifier is required.');
    }

    let project = null;

    if (UUID_REGEX.test(slugOrId)) {
      project = await prisma.project.findFirst({
        where: {
          OR: [{ id: slugOrId }, { slug: slugOrId }],
        },
      });
    } else {
      project = await prisma.project.findUnique({
        where: { slug: slugOrId },
      });
    }

    if (!project) {
      return sendError(res, 404, 'Project not found.');
    }

    return sendSuccess(res, 200, 'Project retrieved successfully.', { project });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new showcase project
 * @route POST /api/projects
 * @access Protected (Admin)
 */
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      category,
      description,
      techStack,
      status,
      isFeatured,
      liveUrl,
      githubUrl,
      previewArchetype,
      order,
    } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return sendError(res, 400, 'Project title is required.');
    }
    if (!category || !category.trim()) {
      return sendError(res, 400, 'Project category is required.');
    }
    if (!description || !description.trim()) {
      return sendError(res, 400, 'Project description is required.');
    }

    // Generate unique slug
    const baseSlug = generateSlug(slug || title);
    const uniqueSlug = await ensureUniqueProjectSlug(prisma, baseSlug);

    // Calculate sequential order if not provided
    let projectOrder = Number(order);
    if (isNaN(projectOrder)) {
      const maxOrderRecord = await prisma.project.aggregate({
        _max: { order: true },
      });
      projectOrder = (maxOrderRecord._max.order ?? 0) + 1;
    }

    // Validate status enum
    let projectStatus = 'ACTIVE';
    if (status && ['ACTIVE', 'PRODUCTION'].includes(status.toUpperCase())) {
      projectStatus = status.toUpperCase();
    }

    const newProject = await prisma.project.create({
      data: {
        title: title.trim(),
        slug: uniqueSlug,
        category: category.trim(),
        description: description.trim(),
        techStack: normalizeTechStack(techStack),
        status: projectStatus,
        isFeatured: Boolean(isFeatured),
        liveUrl: liveUrl?.trim() || null,
        githubUrl: githubUrl?.trim() || null,
        previewArchetype: previewArchetype?.trim() || null,
        order: projectOrder,
      },
    });

    return sendSuccess(res, 201, 'Project created successfully.', { project: newProject });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing project
 * @route PUT /api/projects/:id
 * @access Protected (Admin)
 */
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      category,
      description,
      techStack,
      status,
      isFeatured,
      liveUrl,
      githubUrl,
      previewArchetype,
      order,
    } = req.body;

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return sendError(res, 404, 'Project not found.');
    }

    const updateData = {};

    if (title && title.trim()) {
      updateData.title = title.trim();
    }
    if (category && category.trim()) {
      updateData.category = category.trim();
    }
    if (description && description.trim()) {
      updateData.description = description.trim();
    }
    if (techStack !== undefined) {
      updateData.techStack = normalizeTechStack(techStack);
    }
    if (status && ['ACTIVE', 'PRODUCTION'].includes(status.toUpperCase())) {
      updateData.status = status.toUpperCase();
    }
    if (isFeatured !== undefined) {
      updateData.isFeatured = Boolean(isFeatured);
    }
    if (liveUrl !== undefined) {
      updateData.liveUrl = liveUrl?.trim() || null;
    }
    if (githubUrl !== undefined) {
      updateData.githubUrl = githubUrl?.trim() || null;
    }
    if (previewArchetype !== undefined) {
      updateData.previewArchetype = previewArchetype?.trim() || null;
    }
    if (order !== undefined && !isNaN(Number(order))) {
      updateData.order = Number(order);
    }

    // Recompute slug if title changed or explicit slug provided
    if (slug && slug.trim()) {
      const baseSlug = generateSlug(slug);
      updateData.slug = await ensureUniqueProjectSlug(prisma, baseSlug, id);
    } else if (title && title.trim() && title.trim() !== existingProject.title) {
      const baseSlug = generateSlug(title);
      updateData.slug = await ensureUniqueProjectSlug(prisma, baseSlug, id);
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return sendSuccess(res, 200, 'Project updated successfully.', { project: updatedProject });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle featured spotlight status
 * @route PATCH /api/projects/:id/featured
 * @access Protected (Admin)
 */
export const toggleFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return sendError(res, 404, 'Project not found.');
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        isFeatured: !existing.isFeatured,
      },
    });

    return sendSuccess(res, 200, 'Project spotlight status updated.', { project: updatedProject });
  } catch (error) {
    next(error);
  }
};

/**
 * Batch reorder projects display sequence
 * @route PUT /api/projects/reorder
 * @access Protected (Admin)
 */
export const reorderProjects = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return sendError(res, 400, 'An array of project ordering items is required.');
    }

    // Transactionally update each project's order sequence
    await prisma.$transaction(
      items.map((item) =>
        prisma.project.update({
          where: { id: item.id },
          data: { order: Number(item.order) || 0 },
        })
      )
    );

    const reorderedProjects = await prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return sendSuccess(res, 200, 'Projects display order synchronized.', {
      projects: reorderedProjects,
      count: reorderedProjects.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Permanently delete a project
 * @route DELETE /api/projects/:id
 * @access Protected (Admin)
 */
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return sendError(res, 404, 'Project not found.');
    }

    await prisma.project.delete({
      where: { id },
    });

    return sendSuccess(res, 200, 'Project successfully deleted.', {
      id,
      slug: existing.slug,
      title: existing.title,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProjects,
  getProjectBySlugOrId,
  createProject,
  updateProject,
  toggleFeatured,
  reorderProjects,
  deleteProject,
};
