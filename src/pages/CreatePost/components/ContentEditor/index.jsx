import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import marked from 'marked';
import hljs from "highlight.js";
// highlight.js 样式demo：https://highlightjs.org/static/demo/
import 'highlight.js/styles/github.css';
import IceContainer from '@icedesign/container';
import { Input, Grid, Form, Button, Select, Message } from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IcePanel from '@icedesign/panel';
import _ from 'lodash';

import Markdown from './Markdown';
import styles from './index.module.scss';
import { useRequest, request } from '@/utils/request';
import { api } from '@/utils/api';

const { Row, Col } = Grid;
const FormItem = Form.Item;

function ContentEditor(props) {
  let formRef;
  const renderer = new marked.Renderer();
  marked.setOptions({
    renderer,
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
    highlight (code) {
      return hljs.highlightAuto(code).value;
    },
  });
  const [value, setValue] = useState({
    name: '',
    introduce: '',
    content: '',
    type: '',
    tags: [],
  });
  const [markdownContent, setMarkdownContent] = useState('预览内容'); // html内容

  const { response: typeList, request: fetchType } = useRequest({
    url: api.getTypeList().url,
  });

  const {  response: tagList, request: fetchTag } = useRequest({
    url: api.getTagList().url,
  });

  const formChange = formValue => setValue(formValue);

  const setPreviewContent = value => {
    const html = marked(value);
    setMarkdownContent(html);
  };

  const fetchPost = async id => {
    const { url, method } = api.getPostById(id);
    try {
      const { data } = await request({
        url,
        method,
     });
      setValue({
        name: data.name,
        introduce: data.introduce,
        content: data.content,
        type: data.type._id,
        tags: data.tags,
      });
      setPreviewContent(data.content);
    } catch (error) {
      throw error;
    }
  };

  const changeContent = content => {
    setValue({
      ...value,
      content,
    });
    setPreviewContent(content);
  };

  const handleSubmit = () => {
    formRef.validateAll(async (errors, values) => {
      if (errors) {
        return false;
      }
      const { url, method } = api.addPost();
      await request({
        url,
        method,
        data: values,
     });
      Message.success('提交成功');
      props.history.push('/post/list');
    });
  };

  useEffect(() => {
    fetchType();
    fetchTag();
    if (props.match.params.id) {
      fetchPost(props.match.params.id);
    }
  }, []);

  return (
    <div className="content-editor">
      <IceFormBinderWrapper
        ref={(refInstance) => {
          formRef = refInstance;
        }}
        value={value}
        onChange={formChange}
      >
        <IceContainer>
          <h2 className={styles.name}>添加文章</h2>
          <Form labelAlign="top" className={styles.form}>
            <Row>
              <Col span="11">
                <FormItem label="标题" required>
                  <IceFormBinder name="name" required message="标题必填">
                    <Input placeholder="这里填写文章标题" />
                  </IceFormBinder>
                  <IceFormError name="name" />
                </FormItem>
              </Col>
              <Col span="11" offset="1">
                <FormItem label="标签" required>
                  <IceFormBinder
                    name="tags"
                    required
                    type="array"
                    message="标签必填支持多个"
                  >
                    <Select
                      style={{ width: '100%' }}
                      mode="multiple"
                      placeholder="请选择分类"
                      dataSource={(_.get(tagList, 'data.data') || []).map(v => ({ value: v._id, label: v.cn_name }))}
                    />
                  </IceFormBinder>
                  <IceFormError name="tags" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="分类" required>
                  <IceFormBinder
                    name="type"
                    required
                    message="分类必填支持多个"
                  >
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择分类"
                      dataSource={(_.get(typeList, 'data.data') || []).map(v => ({ value: v._id, label: v.cn_name }))}
                    />
                  </IceFormBinder>
                  <IceFormError
                    name="type"
                    render={(errors) => {
                      console.log('errors', errors);
                      return (
                        <div>
                          <span style={{ color: 'red' }}>
                            {errors.map(item => item.message).join(',')}
                          </span>
                          <span className={styles.mr}>
                            不知道选择什么分类？请
                            {' '}
                            <Link to="/cate/list">点击这里</Link>
                            {' '}
                            查看
                          </span>
                        </div>
                      );
                    }}
                  />
                </FormItem>
              </Col>
            </Row>
            <FormItem label="简介">
              <IceFormBinder name="introduce">
                <Input.TextArea placeholder="这里填写正文简介" />
              </IceFormBinder>
            </FormItem>
            <FormItem label="正文" required>
              <IceFormBinder name="content" required message="请填写文章内容">
                <Markdown value={value.content} changeContent={changeContent} />
              </IceFormBinder>
              <IceFormError name="content" />
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={handleSubmit}>
                发布文章
              </Button>
            </FormItem>
            <FormItem className="pt-3">
              <IcePanel status="info" style={{marginBottom: '10px'}}>
                <IcePanel.Header>
                  预览
                </IcePanel.Header>
                <IcePanel.Body>
                  <div dangerouslySetInnerHTML={{ __html: markdownContent }} />
                </IcePanel.Body>
              </IcePanel>
            </FormItem>
          </Form>
        </IceContainer>
      </IceFormBinderWrapper>
    </div>
  );
}

export default withRouter(ContentEditor);
