import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Input, Button, Message } from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceIcon from '@icedesign/foundation-symbol';
import styles from './index.module.scss';
import { request } from '@/utils/request';
import { api } from '@/utils/api';
import { ROUTER_BASE_PATH } from '@/constants';

const UserRegister = (props) => {
  const [value, setValue] = useState({
    name: '',
    email: '',
    password: '',
    rePasswd: '',
  });

  let formRef;

  const checkPasswd = (rule, values, callback) => {
    if (!values) {
      callback('请输入正确的密码');
    } else if (values.length < 8) {
      callback('密码必须大于8位');
    } else if (values.length > 16) {
      callback('密码必须小于16位');
    } else {
      callback();
    }
  };

  const checkPasswd2 = (rule, values, callback, stateValues) => {
    if (!values) {
      callback('请输入正确的密码');
    } else if (values && values !== stateValues.password) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  };

  const formChange = formValue => setValue(formValue);

  const handleSubmit = () => {
    formRef.validateAll(async (errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
      const { url, method } = api.register();
      const data = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      await request({
        url,
        method,
        data,
     });
      Message.success('注册成功');
      props.history.push(`${ROUTER_BASE_PATH}/user/login`);
    });
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>注 册</h4>
      <IceFormBinderWrapper
        value={value}
        onChange={formChange}
        ref={form => formRef = form}
      >
        <div className={styles.formItems}>
          <div className={styles.formItem}>
            <IceIcon type="person" size="small" className={styles.inputIcon} />
            <IceFormBinder name="name" required message="请输入正确的用户名">
              <Input
                size="large"
                placeholder="用户名"
                className={styles.inputCol}
              />
            </IceFormBinder>
            <IceFormError name="name" />
          </div>

          <div className={styles.formItem}>
            <IceIcon type="mail" size="small" className={styles.inputIcon} />
            <IceFormBinder
              type="email"
              name="email"
              required
              message="请输入正确的邮箱"
            >
              <Input
                size="large"
                maxLength={20}
                placeholder="邮箱"
                className={styles.inputCol}
              />
            </IceFormBinder>
            <IceFormError name="email" />
          </div>

          <div className={styles.formItem}>
            <IceIcon type="lock" size="small" className={styles.inputIcon} />
            <IceFormBinder
              name="password"
              required
              validator={checkPasswd}
            >
              <Input
                htmlType="password"
                size="large"
                placeholder="至少8位密码"
                className={styles.inputCol}
              />
            </IceFormBinder>
            <IceFormError name="password" />
          </div>

          <div className={styles.formItem}>
            <IceIcon type="lock" size="small" className={styles.inputIcon} />
            <IceFormBinder
              name="rePasswd"
              required
              validator={(rule, values, callback) => checkPasswd2(rule, values, callback, value)
              }
            >
              <Input
                htmlType="password"
                size="large"
                placeholder="确认密码"
                className={styles.inputCol}
                onPressEnter={handleSubmit}
              />
            </IceFormBinder>
            <IceFormError name="rePasswd" />
          </div>

          <div className="footer">
            <Button
              type="primary"
              onClick={handleSubmit}
              className={styles.submitBtn}
              size="large"
            >
              注 册
            </Button>
            <Link to={`${ROUTER_BASE_PATH}/user/login`} className={styles.tips}>
              使用已有账户登录
            </Link>
          </div>
        </div>
      </IceFormBinderWrapper>
    </div>
  );
};

export default withRouter(UserRegister);
