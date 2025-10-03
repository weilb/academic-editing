import React, { useState } from 'react';
import { Upload, message, Space, Typography, Card } from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
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
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={3}>
            <FileTextOutlined /> 上传医学论文
          </Title>
          <Text type="secondary">
            支持 PDF、Word (docx/doc) 和 TXT 格式，文件大小不超过 10MB
          </Text>
        </div>

        <Dragger
          name="file"
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          accept=".pdf,.doc,.docx,.txt"
          maxCount={1}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            上传您的医学论文，系统将自动进行智能审核分析
          </p>
        </Dragger>
      </Space>
    </Card>
  );
};

export default FileUpload;
