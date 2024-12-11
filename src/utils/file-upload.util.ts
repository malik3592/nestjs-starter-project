import { promises as fsPromises } from 'fs';
import { join, resolve } from 'path';

const { writeFile, mkdir, stat } = fsPromises;

const uploadFile = async (
  file: string,
  fileName?: string,
): Promise<string | null> => {
  try {
    // Validate the base64 string format
    const match = file.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      throw new Error('Invalid file format');
    }

    const [, fileType, fileData] = match;
    const [fileMainType, fileSubType] = fileType.split('/');
    const fileBuffer = Buffer.from(fileData, 'base64');
    fileName = `${fileName || Date.now()}.${fileSubType}`;

    // Determine folder based on file type
    const filePathPrefix = getFilePathPrefix(fileMainType);
    const filePath = join(filePathPrefix, fileName); // Use `join` to create correct path

    // Ensure the directory exists
    await ensureDirectoryExists(filePathPrefix);

    // Write the file to the specified path
    await writeFile(filePath, fileBuffer);

    // Return the relative file path for public usage
    return filePath.split('public')?.[1].replaceAll('\\', '/');
  } catch (err) {
    console.error('File upload error:', err);
    return null;
  }
};

// Helper function to determine the file path prefix
const getFilePathPrefix = (fileMainType: string): string => {
  const baseDir = resolve(__dirname, '../../public'); // Adjust base directory to project root
  switch (fileMainType) {
    case 'image':
      return join(baseDir, 'images');
    case 'video':
      return join(baseDir, 'videos');
    default:
      return join(baseDir, 'files');
  }
};

// Helper function to ensure directory exists
const ensureDirectoryExists = async (directory: string): Promise<void> => {
  try {
    await stat(directory);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Directory doesn't exist, create it
      await mkdir(directory, { recursive: true });
    } else {
      throw err;
    }
  }
};

export default uploadFile;
