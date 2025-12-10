const { spawn } = require('child_process');
const path = require('path');

class MediaPipeService {
    constructor() {
        this.pythonScript = path.join(__dirname, '../../python/extract_pose.py');
    }

    async extractKeypoints(imagePath) {
        return new Promise((resolve, reject) => {
            const python = spawn('python3', [this.pythonScript, imagePath]);
            
            let stdout = '';
            let stderr = '';

            python.stdout.on('data', (data) => { stdout += data.toString(); });
            python.stderr.on('data', (data) => { stderr += data.toString(); });

            python.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Python exited with code ${code}: ${stderr}`));
                    return;
                }

                try {
                    const lines = stdout.trim().split('\n');
                    let jsonLine = lines[lines.length - 1];
                    
                    for (const line of lines) {
                        if (line.trim().startsWith('{')) {
                            jsonLine = line.trim();
                            break;
                        }
                    }
                    
                    resolve(JSON.parse(jsonLine));
                } catch (err) {
                    reject(new Error(`Failed to parse output: ${stdout}`));
                }
            });

            python.on('error', (error) => {
                reject(new Error(`Failed to start Python: ${error.message}`));
            });
        });
    }
}

module.exports = new MediaPipeService();
