
import { documentDirectory, writeAsStringAsync, EncodingType } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface ClipDownloadOptions {
  videoId: string;
  startTime: number;
  endTime: number;
  title: string;
}

class ClipDownloadService {
  async downloadClip(options: ClipDownloadOptions): Promise<boolean> {
    try {
      // Create a mock video file for demonstration
      // In production, you would use FFmpeg or a video processing service
      const fileName = `${options.title.replace(/[^a-zA-Z0-9]/g, '_')}_${options.startTime}-${options.endTime}.mp4`;
      const filePath = `${documentDirectory}${fileName}`;

      // Create a placeholder file
      await writeAsStringAsync(
        filePath,
        `Video clip: ${options.title}\nStart: ${options.startTime}s\nEnd: ${options.endTime}s`,
        { encoding: EncodingType.UTF8 }
      );

      // Share the file
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'video/mp4',
          dialogTitle: `Share ${options.title}`,
        });
        return true;
      } else {
        console.log('Sharing not available on this platform');
        return false;
      }
    } catch (error) {
      console.log('Error downloading clip:', error);
      return false;
    }
  }

  async generateClipUrl(videoId: string, startTime: number, endTime: number): Promise<string> {
    // Generate a YouTube URL with start time parameter
    // Note: This creates a link to the original video at the start time
    // For actual clip extraction, you would need a video processing service
    const startSeconds = Math.floor(startTime);
    return `https://www.youtube.com/watch?v=${videoId}&t=${startSeconds}s`;
  }

  async exportClipMetadata(
    videoId: string,
    startTime: number,
    endTime: number,
    title: string,
    summary: string
  ): Promise<boolean> {
    try {
      const metadata = {
        videoId,
        startTime,
        endTime,
        duration: endTime - startTime,
        title,
        summary,
        exportedAt: new Date().toISOString(),
      };

      const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_metadata.json`;
      const filePath = `${documentDirectory}${fileName}`;

      await writeAsStringAsync(
        filePath,
        JSON.stringify(metadata, null, 2),
        { encoding: EncodingType.UTF8 }
      );

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/json',
          dialogTitle: 'Share Clip Metadata',
        });
      }

      return true;
    } catch (error) {
      console.log('Error exporting metadata:', error);
      return false;
    }
  }
}

export default new ClipDownloadService();
