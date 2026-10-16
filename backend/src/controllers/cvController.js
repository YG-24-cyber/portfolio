import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * Get active production CV release artifact
 * @route GET /api/cv/active
 * @access Public
 */
export const getActiveCV = async (req, res, next) => {
  try {
    // Attempt to locate explicitly activated CV
    let activeRelease = await prisma.cVRelease.findFirst({
      where: { isActive: true },
    });

    // Fallback to latest created release if none explicitly activated
    if (!activeRelease) {
      activeRelease = await prisma.cVRelease.findFirst({
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!activeRelease) {
      return sendError(res, 404, 'No CV release artifact found.');
    }

    return sendSuccess(res, 200, 'Active CV release artifact retrieved.', {
      release: activeRelease,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all CV version releases
 * @route GET /api/cv/releases
 * @access Public
 */
export const getAllReleases = async (req, res, next) => {
  try {
    const releases = await prisma.cVRelease.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, 200, 'CV release artifacts retrieved.', {
      releases,
      count: releases.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atomically record a CV download event and update telemetry
 * @route POST /api/cv/download
 * @access Public
 */
export const recordDownload = async (req, res, next) => {
  try {
    // Locate or initialize the singleton system telemetry record
    let telemetry = await prisma.systemTelemetry.findFirst();

    if (!telemetry) {
      telemetry = await prisma.systemTelemetry.create({
        data: {
          totalCvDownloads: 708,
          lastCvDownloadAt: new Date(),
        },
      });
    }

    // Atomically increment the download counter and update timestamp
    const updatedTelemetry = await prisma.systemTelemetry.update({
      where: { id: telemetry.id },
      data: {
        totalCvDownloads: { increment: 1 },
        lastCvDownloadAt: new Date(),
      },
    });

    return sendSuccess(res, 200, 'CV download telemetry recorded.', {
      totalCvDownloads: updatedTelemetry.totalCvDownloads,
      lastCvDownloadAt: updatedTelemetry.lastCvDownloadAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get administrative telemetry statistics and active document details
 * @route GET /api/cv/telemetry
 * @access Protected (Admin)
 */
export const getTelemetry = async (req, res, next) => {
  try {
    const [telemetry, activeRelease, totalReleases] = await Promise.all([
      prisma.systemTelemetry.findFirst(),
      prisma.cVRelease.findFirst({ where: { isActive: true } }),
      prisma.cVRelease.count(),
    ]);

    const stats = {
      totalCvDownloads: telemetry?.totalCvDownloads ?? 708,
      lastCvDownloadAt: telemetry?.lastCvDownloadAt ?? null,
      activeVersion: activeRelease?.versionTag ?? 'N/A',
      activeFileName: activeRelease?.fileName ?? 'N/A',
      checksumSha256: activeRelease?.checksumSha256 ?? 'N/A',
      fileSize: activeRelease?.fileSize ?? 'N/A',
      totalReleases,
    };

    return sendSuccess(res, 200, 'CV telemetry statistics retrieved.', { telemetry: stats });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new CV release version
 * @route POST /api/cv/releases
 * @access Protected (Admin)
 */
export const createRelease = async (req, res, next) => {
  try {
    const {
      versionTag,
      fileName,
      targetSpecialization,
      fileSize,
      checksumSha256,
      changelog,
      isActive,
    } = req.body;

    if (!versionTag || !versionTag.trim()) {
      return sendError(res, 400, 'Version tag is required.');
    }
    if (!fileName || !fileName.trim()) {
      return sendError(res, 400, 'File name is required.');
    }
    if (!targetSpecialization || !targetSpecialization.trim()) {
      return sendError(res, 400, 'Target specialization is required.');
    }
    if (!fileSize || !fileSize.trim()) {
      return sendError(res, 400, 'File size is required.');
    }
    if (!changelog || !changelog.trim()) {
      return sendError(res, 400, 'Changelog description is required.');
    }

    // Check versionTag collision
    const existing = await prisma.cVRelease.findUnique({
      where: { versionTag: versionTag.trim() },
    });
    if (existing) {
      return sendError(res, 409, `Version tag '${versionTag.trim()}' already exists.`);
    }

    const sha256 =
      checksumSha256 && checksumSha256.trim()
        ? checksumSha256.trim()
        : crypto.randomBytes(32).toString('hex');

    const willBeActive = Boolean(isActive);

    let newRelease;

    if (willBeActive) {
      // Execute transactional activation & creation
      newRelease = await prisma.$transaction(async (tx) => {
        await tx.cVRelease.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });

        return tx.cVRelease.create({
          data: {
            versionTag: versionTag.trim(),
            fileName: fileName.trim(),
            targetSpecialization: targetSpecialization.trim(),
            fileSize: fileSize.trim(),
            checksumSha256: sha256,
            changelog: changelog.trim(),
            isActive: true,
          },
        });
      });
    } else {
      newRelease = await prisma.cVRelease.create({
        data: {
          versionTag: versionTag.trim(),
          fileName: fileName.trim(),
          targetSpecialization: targetSpecialization.trim(),
          fileSize: fileSize.trim(),
          checksumSha256: sha256,
          changelog: changelog.trim(),
          isActive: false,
        },
      });
    }

    return sendSuccess(res, 201, 'CV release successfully deployed.', { release: newRelease });
  } catch (error) {
    next(error);
  }
};

/**
 * Switch live active production resume release
 * @route PATCH /api/cv/releases/:id/activate
 * @access Protected (Admin)
 */
export const setActiveRelease = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.cVRelease.findUnique({
      where: { id },
    });

    if (!existing) {
      return sendError(res, 404, 'CV release not found.');
    }

    const updatedRelease = await prisma.$transaction(async (tx) => {
      await tx.cVRelease.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      return tx.cVRelease.update({
        where: { id },
        data: { isActive: true },
      });
    });

    return sendSuccess(res, 200, `CV release ${updatedRelease.versionTag} is now active.`, {
      release: updatedRelease,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an archived CV release
 * @route DELETE /api/cv/releases/:id
 * @access Protected (Admin)
 */
export const deleteRelease = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.cVRelease.findUnique({
      where: { id },
    });

    if (!existing) {
      return sendError(res, 404, 'CV release not found.');
    }

    // Safety rule: Cannot delete the currently active production release
    if (existing.isActive) {
      return sendError(
        res,
        400,
        'Cannot delete the currently active production CV release. Please designate another release as active first.'
      );
    }

    await prisma.cVRelease.delete({
      where: { id },
    });

    return sendSuccess(res, 200, 'CV release successfully deleted.', {
      id,
      versionTag: existing.versionTag,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getActiveCV,
  getAllReleases,
  recordDownload,
  getTelemetry,
  createRelease,
  setActiveRelease,
  deleteRelease,
};
