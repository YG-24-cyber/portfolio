import prisma from '../config/prisma.js';
import { generateSlug, ensureUniqueBlogSlug } from '../utils/slug.js';
import calculateReadTime from '../utils/readTime.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Format tags to clean array of strings
 */
const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

/**
 * Get all blog articles with filtering, search, and pagination
 * @route GET /api/blogs
 * @access Public
 */
export const getBlogs = async (req, res, next) => {
  try {
    const { search, category, tag, featured, page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    const where = {};

    // Search filter across title, excerpt, and tags
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { excerpt: { contains: term, mode: 'insensitive' } },
        { tags: { has: term } },
      ];
    }

    // Category filter
    if (category && category.trim()) {
      where.category = { equals: category.trim(), mode: 'insensitive' };
    }

    // Tag filter
    if (tag && tag.trim()) {
      where.tags = { has: tag.trim() };
    }

    // Featured filter
    if (featured !== undefined) {
      if (featured === 'true' || featured === true) {
        where.isFeatured = true;
      } else if (featured === 'false' || featured === false) {
        where.isFeatured = false;
      }
    }

    // Execute query and count in parallel
    const [blogs, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.blogPost.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNumber) || 1;

    return sendSuccess(res, 200, 'Articles retrieved successfully.', {
      blogs,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single blog post by slug or UUID
 * @route GET /api/blogs/:slugOrId
 * @access Public
 */
export const getBlogBySlugOrId = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    if (!slugOrId) {
      return sendError(res, 400, 'Article slug or identifier is required.');
    }

    let blog = null;

    if (UUID_REGEX.test(slugOrId)) {
      blog = await prisma.blogPost.findFirst({
        where: {
          OR: [{ id: slugOrId }, { slug: slugOrId }],
        },
      });
    } else {
      blog = await prisma.blogPost.findUnique({
        where: { slug: slugOrId },
      });
    }

    if (!blog) {
      return sendError(res, 404, 'Article not found.');
    }

    return sendSuccess(res, 200, 'Article retrieved successfully.', { blog });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new blog post
 * @route POST /api/blogs
 * @access Protected (Admin)
 */
export const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      category,
      excerpt,
      body,
      tags,
      readTime,
      isFeatured,
      publishedAt,
    } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return sendError(res, 400, 'Article title is required.');
    }
    if (!category || !category.trim()) {
      return sendError(res, 400, 'Article category is required.');
    }
    if (!excerpt || !excerpt.trim()) {
      return sendError(res, 400, 'Article excerpt is required.');
    }
    if (!body || !body.trim()) {
      return sendError(res, 400, 'Article content body is required.');
    }

    // Generate unique slug
    const baseSlug = generateSlug(slug || title);
    const uniqueSlug = await ensureUniqueBlogSlug(prisma, baseSlug);

    // Calculate reading time if not explicitly provided
    const estimatedReadTime =
      readTime && String(readTime).trim()
        ? String(readTime).trim()
        : calculateReadTime(body);

    const willBeFeatured = Boolean(isFeatured);

    // Maintain single-hero spotlight exclusivity
    if (willBeFeatured) {
      await prisma.blogPost.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      });
    }

    const newBlog = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: uniqueSlug,
        category: category.trim(),
        excerpt: excerpt.trim(),
        body: body.trim(),
        tags: normalizeTags(tags),
        readTime: estimatedReadTime,
        isFeatured: willBeFeatured,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return sendSuccess(res, 201, 'Article successfully published.', { blog: newBlog });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing blog post
 * @route PUT /api/blogs/:id
 * @access Protected (Admin)
 */
export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      category,
      excerpt,
      body,
      tags,
      readTime,
      isFeatured,
      publishedAt,
    } = req.body;

    const existingBlog = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return sendError(res, 404, 'Article not found.');
    }

    const updateData = {};

    if (title && title.trim()) {
      updateData.title = title.trim();
    }
    if (category && category.trim()) {
      updateData.category = category.trim();
    }
    if (excerpt && excerpt.trim()) {
      updateData.excerpt = excerpt.trim();
    }
    if (body && body.trim()) {
      updateData.body = body.trim();
    }
    if (tags !== undefined) {
      updateData.tags = normalizeTags(tags);
    }
    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : new Date();
    }

    // Handle slug recomputation if title or explicit slug changed
    if (slug && slug.trim()) {
      const baseSlug = generateSlug(slug);
      updateData.slug = await ensureUniqueBlogSlug(prisma, baseSlug, id);
    } else if (title && title.trim() && title.trim() !== existingBlog.title) {
      const baseSlug = generateSlug(title);
      updateData.slug = await ensureUniqueBlogSlug(prisma, baseSlug, id);
    }

    // Handle read time recalculation
    if (readTime && String(readTime).trim()) {
      updateData.readTime = String(readTime).trim();
    } else if (body && body.trim() && body.trim() !== existingBlog.body) {
      updateData.readTime = calculateReadTime(body);
    }

    // Handle single-hero spotlight exclusivity
    if (isFeatured !== undefined) {
      const willBeFeatured = Boolean(isFeatured);
      if (willBeFeatured && !existingBlog.isFeatured) {
        await prisma.blogPost.updateMany({
          where: {
            id: { not: id },
            isFeatured: true,
          },
          data: { isFeatured: false },
        });
      }
      updateData.isFeatured = willBeFeatured;
    }

    const updatedBlog = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    return sendSuccess(res, 200, 'Article successfully updated.', { blog: updatedBlog });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle featured spotlight status
 * @route PATCH /api/blogs/:id/featured
 * @access Protected (Admin)
 */
export const toggleFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return sendError(res, 404, 'Article not found.');
    }

    let nextFeaturedState = false;

    if (!existing.isFeatured) {
      // Unset all other featured articles to maintain single hero spotlight
      await prisma.blogPost.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      });
      nextFeaturedState = true;
    } else {
      nextFeaturedState = false;
    }

    const updatedBlog = await prisma.blogPost.update({
      where: { id },
      data: { isFeatured: nextFeaturedState },
    });

    return sendSuccess(res, 200, 'Article spotlight status updated.', { blog: updatedBlog });
  } catch (error) {
    next(error);
  }
};

/**
 * Permanently delete a blog article
 * @route DELETE /api/blogs/:id
 * @access Protected (Admin)
 */
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return sendError(res, 404, 'Article not found.');
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return sendSuccess(res, 200, 'Article successfully removed from publication registry.', {
      id,
      slug: existing.slug,
      title: existing.title,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getBlogs,
  getBlogBySlugOrId,
  createBlog,
  updateBlog,
  toggleFeatured,
  deleteBlog,
};
