import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initialzeForm, register } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { check } from '../../modules/user';

function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: 'register',
        key: name,
        value,
      }),
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password, passwordConfirm } = form;
    if ([username, password, passwordConfirm].includes('')) {
      setError('빈 값이 없어야합니다.');
      return;
    }
    if (password !== passwordConfirm) {
      console.log('비밀번호가 일치하지 않습니다.');
      setError('비밀번호가 일치하지 않습니다');
      dispatch(changeField({ form: 'register', key: 'password', value: '' }));
      dispatch(
        changeField({ form: 'register', key: 'passwordConfirm', value: '' }),
      );
      return;
    }
    dispatch(register({ username, password }));
  };

  useEffect(() => {
    dispatch(initialzeForm('register'));
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
      console.log('오류발생');
      if (authError.response.status === 409) {
        setError('이미 존재하는 계정입니다.');
        return;
      }
      setError('회원가입 실패');
      return;
    }
    if (auth) {
      console.log('회원가입 성공');
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  useEffect(() => {
    if (user) {
      console.log('checked!!');
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.log('localStorage is not working..');
      }
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <AuthForm
      type="register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
}

export default RegisterForm;
