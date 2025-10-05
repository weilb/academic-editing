import React, { useState } from 'react';
import { Upload, message, Space, Typography } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

const { Text } = Typography;
const { Dragger } = Upload;

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
  wordCount?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded, wordCount }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const beforeUpload = (file: File) => {
    const isPDF = file.type === 'application/pdf';
    const isWord = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                   file.type === 'application/msword';
    const isText = file.type === 'text/plain';

    if (!isPDF && !isWord && !isText) {
      message.error('只支持上传 PDF、Word 或 TXT 格式的文件！');
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件大小不能超过 10MB！');
      return false;
    }

    onFileUploaded(file);
    return false; // 阻止自动上传
  };

  const handleChange = (info: any) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // 只保留最新上传的文件
    setFileList(newFileList);
  };

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2H5C4.46957 2 3.96086 2.21071 3.58579 2.58579C3.21071 2.96086 3 3.46957 3 4V16C3 16.5304 3.21071 17.0391 3.58579 17.4142C3.96086 17.7893 4.46957 18 5 18H15C15.5304 18 16.0391 17.7893 16.4142 17.4142C16.7893 17.0391 17 16.5304 17 16V7L12 2Z" stroke="#d4537b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2V7H17" stroke="#d4537b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <Text strong style={{ color: '#2c3e50', fontSize: 15 }}>上传论文</Text>
          {wordCount && wordCount > 0 && (
            <Text style={{ color: '#d4537b', fontSize: 13, fontWeight: 600 }}>({wordCount} 字)</Text>
          )}
        </div>
      </div>

      <Dragger
        name="file"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        accept=".pdf,.doc,.docx,.txt"
        maxCount={1}
        className="custom-upload-dragger"
      >
        <div className="upload-content">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" stroke="#ffe0e6" strokeWidth="2"/>
            <path d="M20 14V26M14 20H26" stroke="#d4537b" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <Text className="upload-text">点击或拖拽文件到此区域</Text>
          <Text className="upload-hint">支持 PDF、Word、TXT · 不超过 10MB</Text>
        </div>
      </Dragger>
    </Space>
  );
};

export default FileUpload;
