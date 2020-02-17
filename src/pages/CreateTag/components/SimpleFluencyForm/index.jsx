import React, { useState } from 'react';
import IceContainer from '@icedesign/container';
import { Grid, Input, Button, Message } from '@alifd/next';
import {
  FormBinderWrapper,
  FormBinder,
  FormError,
} from '@icedesign/form-binder';

import styles from './index.module.scss';
import { request } from '@/utils/request';
import { api } from '@/utils/api';

const { Row, Col } = Grid;
const Toast = Message;

export default function SimpleFluencyForm() {
  let formRef;

  const [formValue, setFormValue] = useState({
    name: '',
    cn_name: '',
  });

  const formChange = newValue => setFormValue(newValue);

  const handleSubmit = () => {
    formRef.validateAll(async (errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
      const { data } = await request({
        url: api.addTag(),
        method: 'post',
        data: values,
     });
      console.log('data:', data);
      Toast.success('添加成功');
    });
  };

  return (
    <div className={styles.simpleFluencyForm}>
      <IceContainer>
        <FormBinderWrapper
          ref={(form) => {
            formRef = form;
          }}
          value={formValue}
          onChange={formChange}
        >
          <div className="formContent">
            <h2 className={styles.formTitle}>添加标签</h2>
            <Row className={styles.formRow}>
              <Col xxs="6" s="4" l="3" className={styles.formLabel}>
                <span>标签名称：</span>
              </Col>
              <Col xxs="16" s="10" l="6">
                <FormBinder name="name" required message="必填项">
                  <Input />
                </FormBinder>
                <div className={styles.formErrorWrapper}>
                  <FormError name="name" />
                </div>
              </Col>
            </Row>
            <Row className={styles.formRow}>
              <Col xxs="6" s="4" l="3" className={styles.formLabel}>
                <span>缩略名称：</span>
              </Col>
              <Col xxs="16" s="10" l="6">
                <FormBinder name="cn_name" required message="必填项">
                  <Input />
                </FormBinder>
                <div className={styles.formErrorWrapper}>
                  <FormError name="cn_name" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col offset="3">
                <Button
                  onClick={handleSubmit}
                  type="primary"
                >
                  确认
                </Button>
              </Col>
            </Row>
          </div>
        </FormBinderWrapper>
      </IceContainer>
    </div>
  );
}
