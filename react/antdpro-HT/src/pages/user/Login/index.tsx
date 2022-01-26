import {
  AlipayCircleOutlined,
  LockOutlined,
  VerifiedOutlined, 
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, FormInstance,Tooltip  } from 'antd';
import React, { useState, useRef } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, Link, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import styles from './index.less';
// import CryptoJS from 'crypto-js'
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';

// console.log(CryptoJS)
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/** 此方法会跳转到 redirect 参数所在的位置 */
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    history.push(redirect || '/');
  }, 10);
};

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  // 确认当前是帐号还是手机号
  const [type, setType] = useState<string>('account');
  //  确认注册方式
  const [registerType, setRegisterType] = useState<string>('account')
    // 确认登录还是注册
    const [ loginSwitcher, setLoginSwitcher ] = useState<boolean>(false)

  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);
    try {
      // 登录
      console.log(values)
      console.log({ ...values, type })
      const msg = await login({ ...values, type });
      if (msg.status === 'ok') {
        const defaultloginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultloginSuccessMessage);
        await fetchUserInfo();
        goto();
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      const defaultloginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });

      message.error(defaultloginFailureMessage);
    }
    setSubmitting(false);
  };
  const { status, type: loginType } = userLoginState;

  // 一键登录
  const formRef = useRef<FormInstance>();
  const onFill = () => {
    switch (type) {
      case 'account':
        formRef?.current?.setFieldsValue({
          username: 'user',
          password: 'ant.design',
        });
        break;
        case 'mobile':
          formRef?.current?.setFieldsValue({
            mobile: '15936797950',
            captcha: '1234',
          });
          break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.svg" />
              <span className={styles.title}>Ant Design</span>
            </Link>
          </div>
          <div className={styles.desc}>
            {intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          </div>
        </div>

        <div className={styles.main}>
          {/* 注册登录切换 */}
          <div className={styles.loginSwitcher} onClick={() => { setLoginSwitcher(!loginSwitcher) }}>
            <img alt="logo" className={styles.logo} src={loginSwitcher ? '/icons/block.png' : '/icons/show.png'} />
          </div>

          <div className={`${styles.defaults} ${loginSwitcher ? styles.curr : styles.pre}`}>
            <ProForm
              initialValues={{
                autoLogin: true,
              }}
              formRef={formRef}
              submitter={{
                searchConfig: {
                  submitText: intl.formatMessage({
                    id: 'pages.login.submit',
                    defaultMessage: '登录',
                  }),
                },
                render: (props, dom) =>{
                  return dom
                  },
                submitButtonProps: {
                  loading: submitting,
                  size: 'large',
                  className: styles.submit,
                  block:true
                },
                resetButtonProps:{
                  size:'large',
                  className: styles.resize
                }
              }}
              onFinish={async (values) => {
                handleSubmit(values as API.LoginParams);
              }}
            >
              <ProCard
                tabs={{
                  tabPosition: "top",
                  activeKey: type,
                  onChange: (key) => {
                    setType(key);
                  }
                }}
                layout="center"
                ghost
              >
                <ProCard.TabPane key="account"
                  tab={intl.formatMessage({
                    id: 'pages.login.accountLogin.tab',
                    defaultMessage: '账户密码登录',
                  })}>
                  {status === 'error' && loginType === 'account' && (
                    <LoginMessage
                      content={intl.formatMessage({
                        id: 'pages.login.accountLogin.errorMessage',
                        defaultMessage: '账户或密码错误（admin/ant.design)',
                      })}
                    />
                  )}
                  {type === 'account' && (
                    <>
                      <ProFormText
                        name="username"
                        fieldProps={{
                          size: 'large',
                          prefix: <UserOutlined className={styles.prefixIcon} />,
                        }}
                        placeholder={intl.formatMessage({
                          id: 'pages.login.username.placeholder',
                          defaultMessage: '用户名: admin or user',
                        })}
                        rules={[
                          {
                            required: true,
                            message: (
                              <FormattedMessage
                                id="pages.login.username.required"
                                defaultMessage="请输入用户名!"
                              />
                            ),
                          },
                        ]}
                      />
                      <ProFormText.Password
                        name="password"
                        fieldProps={{
                          size: 'large',
                          prefix: <LockOutlined className={styles.prefixIcon} />,
                        }}
                        placeholder={intl.formatMessage({
                          id: 'pages.login.password.placeholder',
                          defaultMessage: '密码: ant.design',
                        })}
                        rules={[
                          {
                            required: true,
                            message: (
                              <FormattedMessage
                                id="pages.login.password.required"
                                defaultMessage="请输入密码！"
                              />
                            ),
                          },
                        ]}
                      />
                    </>
                  )}

                </ProCard.TabPane>
                <ProCard.TabPane key="mobile" tab={intl.formatMessage({
                  id: 'pages.login.phoneLogin.tab',
                  defaultMessage: '手机号登录',
                })}>
                  
              {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
                  {type === 'mobile' && (
                    <>
                      <ProFormText
                        fieldProps={{
                          size: 'large',
                          prefix: <MobileOutlined className={styles.prefixIcon} />,
                        }}
                        name="mobile"
                        placeholder={intl.formatMessage({
                          id: 'pages.login.phoneNumber.placeholder',
                          defaultMessage: '手机号',
                        })}
                        rules={[
                          {
                            required: true,
                            message: (
                              <FormattedMessage
                                id="pages.login.phoneNumber.required"
                                defaultMessage="请输入手机号！"
                              />
                            ),
                          },
                          {
                            pattern: /^1\d{10}$/,
                            message: (
                              <FormattedMessage
                                id="pages.login.phoneNumber.invalid"
                                defaultMessage="手机号格式错误！"
                              />
                            ),
                          },
                        ]}
                      />
                      <ProFormCaptcha
                        fieldProps={{
                          size: 'large',
                          prefix: <LockOutlined className={styles.prefixIcon} />,
                        }}
                        captchaProps={{
                          size: 'large',
                        }}
                        placeholder={intl.formatMessage({
                          id: 'pages.login.captcha.placeholder',
                          defaultMessage: '请输入验证码',
                        })}
                        captchaTextRender={(timing, count) => {
                          if (timing) {
                            return `${count} ${intl.formatMessage({
                              id: 'pages.getCaptchaSecondText',
                              defaultMessage: '获取验证码',
                            })}`;
                          }
                          return intl.formatMessage({
                            id: 'pages.login.phoneLogin.getVerificationCode',
                            defaultMessage: '获取验证码',
                          });
                        }}
                        name="captcha"
                        rules={[
                          {
                            required: true,
                            message: (
                              <FormattedMessage
                                id="pages.login.captcha.required"
                                defaultMessage="请输入验证码！"
                              />
                            ),
                          },
                        ]}
                        onGetCaptcha={async (phone) => {
                          const result = await getFakeCaptcha({
                            phone,
                          });
                          if (result === false) {
                            return;
                          }
                          message.success('获取验证码成功！验证码为：1234');
                        }}
                      />
                    </>
                  )}
                </ProCard.TabPane>
              </ProCard>
              <div
                style={{
                  margin: '0px 24px 24px'
                }}
              >
                <ProFormCheckbox noStyle name="autoLogin">
                  <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
                </ProFormCheckbox>
                
                <Tooltip placement="top" title={intl.formatMessage({
                    id: 'pages.login.touristTips'
                  })}>
                  <span onClick={onFill} className={styles.userFil}>
                    <FormattedMessage id="pages.login.userRememberMe" defaultMessage="游客登录"/>
                  </span>
                 </Tooltip>

                <a
                  style={{
                    float: 'right',
                  }}
                >
                  <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
                </a>
              </div>
            </ProForm>

            <Space className={styles.other}>
              <FormattedMessage id="pages.login.loginWith" defaultMessage="其他登录方式" />
              <AlipayCircleOutlined className={styles.icon} />
              <TaobaoCircleOutlined className={styles.icon} />
              <WeiboCircleOutlined className={styles.icon} />
              <VerifiedOutlined className={styles.icon}/>
            </Space>
          </div>
          <div className={`${styles.defaults} ${loginSwitcher ? styles.pre : styles.curr}`}>
            <ProCard 
            tabs={{
              tabPosition: "top",
              activeKey: registerType,
              onChange: (key) => {
                setRegisterType(key);
              }
            }}
            layout="center"
            ghost>
             <ProCard.TabPane 
             key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountRegistration.tab',
                defaultMessage: '账户密码注册',
              })}>
             </ProCard.TabPane>
             <ProCard.TabPane 
             key="email"
              tab={intl.formatMessage({
                id: 'pages.login.emailRegistration.tab',
                defaultMessage: '邮箱注册',
              })}>
             </ProCard.TabPane>
             <ProCard.TabPane 
             key="handset"
              tab={intl.formatMessage({
                id: 'pages.login.mobileRegistration.tab',
                defaultMessage: '手机注册',
              })}>
             </ProCard.TabPane>
            </ProCard>
          </div>
        </div>

      </div>
      <Footer />
    </div>

  );
};

export default Login;
