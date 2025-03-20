import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ログインコンポーネント
 * ユーザー認証のためのログインフォームを提供します。
 * 
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Function} props.onLogin - ログイン成功時に呼び出されるコールバック関数
 * @param {boolean} props.isLoading - ログイン処理中かどうかを示すフラグ
 * @param {string} props.errorMessage - エラーメッセージ（存在する場合）
 * @returns {JSX.Element} ログインフォームコンポーネント
 */
const Login = ({ onLogin, isLoading = false, errorMessage = '' }) => {
  // フォームの状態を管理するステート
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // 入力値の検証エラーを管理するステート
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: ''
  });

  // フォーム送信が可能かどうかを管理するステート
  const [isFormValid, setIsFormValid] = useState(false);

  /**
   * フォーム入力の変更を処理するハンドラー
   * @param {Event} event - 入力イベント
   */
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    
    // チェックボックスの場合は checked プロパティを使用、それ以外は value を使用
    const inputValue = type === 'checkbox' ? checked : value;
    
    // フォームデータの更新
    setFormData(prevData => ({
      ...prevData,
      [name]: inputValue
    }));
  };

  /**
   * ログインフォームの送信を処理するハンドラー
   * @param {Event} event - フォーム送信イベント
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // フォームの検証を実行
    const errors = validateForm();
    
    // エラーがある場合は処理を中止
    if (Object.values(errors).some(error => error !== '')) {
      setValidationErrors(errors);
      return;
    }
    
    // ログイン処理の実行
    onLogin({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe
    });
  };

  /**
   * フォームデータのバリデーションを行う
   * @returns {Object} フィールドごとのエラーメッセージを含むオブジェクト
   */
  const validateForm = () => {
    const errors = {
      email: '',
      password: ''
    };
    
    // メールアドレスの検証
    if (!formData.email) {
      errors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '有効なメールアドレスを入力してください';
    }
    
    // パスワードの検証
    if (!formData.password) {
      errors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 8) {
      errors.password = 'パスワードは8文字以上である必要があります';
    }
    
    return errors;
  };

  /**
   * フォームデータが変更されるたびに検証を実行する副作用
   */
  useEffect(() => {
    const errors = validateForm();
    setValidationErrors(errors);
    
    // すべてのフィールドにエラーがないかチェック
    const formIsValid = Object.values(errors).every(error => error === '');
    setIsFormValid(formIsValid && formData.email !== '' && formData.password !== '');
  }, [formData]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">アカウントにログイン</h2>
        
        {/* エラーメッセージの表示 */}
        {errorMessage && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          {/* メールアドレス入力フィールド */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
              placeholder="your@email.com"
              aria-required="true"
              aria-invalid={!!validationErrors.email}
              aria-describedby={validationErrors.email ? "email-error" : undefined}
              disabled={isLoading}
            />
            {validationErrors.email && (
              <p id="email-error" className="error-text">
                {validationErrors.email}
              </p>
            )}
          </div>
          
          {/* パスワード入力フィールド */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${validationErrors.password ? 'input-error' : ''}`}
              placeholder="********"
              aria-required="true"
              aria-invalid={!!validationErrors.password}
              aria-describedby={validationErrors.password ? "password-error" : undefined}
              disabled={isLoading}
            />
            {validationErrors.password && (
              <p id="password-error" className="error-text">
                {validationErrors.password}
              </p>
            )}
          </div>
          
          {/* Remember Me チェックボックス */}
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="form-checkbox"
              disabled={isLoading}
            />
            <label htmlFor="rememberMe" className="checkbox-label">
              ログイン状態を保持する
            </label>
          </div>
          
          {/* パスワードリセットリンク */}
          <div className="password-reset">
            <a href="/reset-password" className="reset-link">
              パスワードをお忘れですか？
            </a>
          </div>
          
          {/* ログインボタン */}
          <button
            type="submit"
            className="login-button"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        
        {/* 登録リンク */}
        <div className="signup-option">
          <p>
            アカウントをお持ちでないですか？{' '}
            <a href="/signup" className="signup-link">
              新規登録
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// プロパティの型定義
Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  errorMessage: PropTypes.string
};

export default Login;