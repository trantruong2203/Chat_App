import React from 'react';
import {
  Layout,
  Card,
  List,
  Typography,
  Spin,
  Tag,
  Button,
  Alert,
} from 'antd';
import {
  ReadOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { NewsArticle } from '../../hooks/useNewsData';

const { Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

interface NewsSidebarProps {
  newsArticles: NewsArticle[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const NewsSidebar: React.FC<NewsSidebarProps> = React.memo(({
  newsArticles,
  loading,
  error,
  onRefresh
}) => {
  return (
    <Sider
      width={380}
      style={{
        overflow: 'auto',
        height: 'calc(100vh - 0px)',
        position: 'fixed',
        left: 80,
        backgroundColor: 'var(--yahoo-bg)',
        padding: '20px 10px',
        boxShadow: '1px 0 3px var(--yahoo-border)'
      }}
      theme="dark"
    >
      <div style={{ marginBottom: 16, padding: '0 5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>
            <ReadOutlined style={{ marginRight: 8 }} />
            Tin tức mới nhất
          </Title>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
            size="small"
          />
        </div>

        {error && (
          <Alert
            message={error}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" onClick={onRefresh}>
                Thử lại
              </Button>
            }
          />
        )}

        {loading ? (
          <div style={{ width: '300px', textAlign: 'center', padding: '20px 0' }}>
            <Spin />
            <div style={{ marginTop: 10 }}>Đang tải tin tức...</div>
          </div>
        ) : (
          <List
            dataSource={newsArticles}
            renderItem={(article: NewsArticle) => (
              <List.Item style={{ padding: 0, marginBottom: 16 }}>
                <Card
                  hoverable
                  style={{ width: '100%', borderRadius: 8, overflow: 'hidden' }}
                  cover={
                    article.image_url ? (
                      <div style={{ height: 140, overflow: 'hidden' }}>
                        <img
                          alt={article.title}
                          src={article.image_url}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x140?text=Không+có+hình+ảnh';
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        height: 140,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5'
                      }}>
                        <Text type="secondary">Không có hình ảnh</Text>
                      </div>
                    )
                  }
                >
                  <div style={{ padding: '0 8px' }}>
                    {article.source && (
                      <Tag color="blue" style={{ marginBottom: 8 }}>
                        {article.source.name}
                      </Tag>
                    )}
                    <Title
                      level={5}
                      ellipsis={{ rows: 2 }}
                      style={{ marginTop: 0, height: 48, overflow: 'hidden' }}
                    >
                      {article.title}
                    </Title>
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      type="secondary"
                      style={{ fontSize: 12, height: 40 }}
                    >
                      {article.description || 'Không có mô tả chi tiết'}
                    </Paragraph>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 8
                    }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {article.pubDate}
                      </Text>
                      <Button
                        type="link"
                        size="small"
                        icon={<LinkOutlined />}
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Đọc thêm
                      </Button>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </Sider>
  );
});

NewsSidebar.displayName = 'NewsSidebar';

export default NewsSidebar;