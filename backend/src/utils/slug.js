/**
 * URL Slug Generator and Collision Resolver Utility
 */

/**
 * Converts input text into a sanitized URL-friendly kebab-case slug.
 * @param {string} text - Raw string to convert
 * @returns {string} Sanitized slug
 */
export const generateSlug = (text = '') => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Decompose combined accents
    .replace(/[\u0300-\u036f]/g, '') // Strip diacritic accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except space and hyphen
    .replace(/\s+/g, '-') // Replace spaces with hyphen
    .replace(/-+/g, '-') // Condense duplicate consecutive hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading and trailing hyphens
};

/**
 * Checks for project slug collisions in PostgreSQL and generates an incremental numerical suffix if necessary.
 * @param {object} prisma - Prisma client instance
 * @param {string} baseSlug - Desired slug string
 * @param {string|null} [excludeId] - Optional project ID to exclude (useful during updates)
 * @returns {Promise<string>} Unique slug
 */
export const ensureUniqueProjectSlug = async (prisma, baseSlug, excludeId = null) => {
  let uniqueSlug = baseSlug || 'project';
  let counter = 1;

  while (true) {
    const existing = await prisma.project.findUnique({
      where: { slug: uniqueSlug },
      select: { id: true },
    });

    if (!existing || (excludeId && existing.id === excludeId)) {
      return uniqueSlug;
    }

    counter += 1;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
};

/**
 * Checks for blog article slug collisions in PostgreSQL and generates an incremental numerical suffix if necessary.
 * @param {object} prisma - Prisma client instance
 * @param {string} baseSlug - Desired slug string
 * @param {string|null} [excludeId] - Optional blog ID to exclude (useful during updates)
 * @returns {Promise<string>} Unique slug
 */
export const ensureUniqueBlogSlug = async (prisma, baseSlug, excludeId = null) => {
  let uniqueSlug = baseSlug || 'article';
  let counter = 1;

  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: uniqueSlug },
      select: { id: true },
    });

    if (!existing || (excludeId && existing.id === excludeId)) {
      return uniqueSlug;
    }

    counter += 1;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
};

export default {
  generateSlug,
  ensureUniqueProjectSlug,
  ensureUniqueBlogSlug,
};
