import React from 'react';
import { Row, Col, Image } from 'antd';

interface Props {
  images: string[];
}

const PostImages: React.FC<Props> = ({ images }) => {
  const count = images.length;

  return (
    <Image.PreviewGroup>
      {count === 1 && (
        <Image width="100%" src={images[0]} style={{ borderRadius: 8 }} />
      )}

      {count === 2 && (
        <Row gutter={8}>
          {images.map((img, i) => (
            <Col span={12} key={i}>
              <Image width="100%" src={img} style={{ borderRadius: 8 }} />
            </Col>
          ))}
        </Row>
      )}

      {count === 3 && (
        <Row gutter={8}>
          <Col span={16}>
            <Image width="100%" src={images[0]} style={{ borderRadius: 8 }} />
          </Col>
          <Col span={8}>
            <Row gutter={[0, 8]}>
              <Col span={24}>
                <Image width="100%" src={images[1]} style={{ borderRadius: 8 }} />
              </Col>
              <Col span={24}>
                <Image width="100%" src={images[2]} style={{ borderRadius: 8 }} />
              </Col>
            </Row>
          </Col>
        </Row>
      )}

      {count >= 4 && (
        <Row gutter={8}>
          <Col span={12}>
            <Row gutter={[0, 8]}>
              <Col span={24}>
                <Image width="100%" src={images[0]} style={{ borderRadius: 8 }} />
              </Col>
              <Col span={24}>
                <Image width="100%" src={images[2]} style={{ borderRadius: 8 }} />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={[0, 8]}>
              <Col span={24}>
                <Image width="100%" src={images[1]} style={{ borderRadius: 8 }} />
              </Col>
              <Col span={24} style={{ position: 'relative' }}>
                <Image width="100%" src={images[3]} style={{ borderRadius: 8 }} />
                {count > 4 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      fontSize: 32,
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                    }}
                  >
                    +{count - 4}
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </Image.PreviewGroup>
  );
};

export default PostImages;
