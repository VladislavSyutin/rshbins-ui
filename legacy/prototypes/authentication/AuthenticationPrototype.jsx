import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LoaderBrand from '../../components/loader-brand/index.js';
import Cookies from '../../components/cookies/index.js';
import DialogModal from '../../dialogs/modals/dialog-modal/index.js';
import DialogToast from '../../dialogs/toasts/dialog-toast/index.js';
import AuthenticationFirstScreen from '../../templates/authentication/authentication-first-screen/index.js';
import AuthenticationEmailConfirmation from '../../templates/authentication/authentication-email-confirmation/index.js';
import AuthenticationPhoneConfirmation from '../../templates/authentication/authentication-phone-confirmation/index.js';
import AuthenticationCreatingLoginPassword from '../../templates/authentication/authentication-creating-login-password/index.js';
import AuthenticationRegistrationData from '../../templates/authentication/authentication-registration-data/index.js';
import AuthenticationRegistration from '../../templates/authentication/authentication-registration/index.js';
import AuthenticationRestoringAccess from '../../templates/authentication/authentication-restoring-access/index.js';
import './styles.css';

var COOKIES_XS_BREAKPOINT = 743;
var INITIAL_LOADING_DURATION_MS = 7000;
var CAPTCHA_PHONE_NUMBER = '79999999992';
var CAPTCHA_TIMEOUT_VALUE = 'timeout';
var REGISTRATION_SKIPPED_PHONE_NUMBERS = new Set([
  '79999999990',
  '79999999991',
  CAPTCHA_PHONE_NUMBER
]);
var PROOF_OF_IDENTITY_PHONE_NUMBERS = new Set(['79999999991']);
var LOG_IN_THROUGH_THE_GOSUSLUGI_EMAIL = 'info@rshbins.ru';
var CORPORATE_SUCCESS_LOGIN = 'login';
var CORPORATE_SUCCESS_PASSWORD = 'password';
var PHONE_LOGIN_LOADING_DURATION_MS = 3000;
var RESTORING_ACCESS_LOADING_DURATION_MS = 3000;
var CODE_CHECK_LOADING_DURATION_MS = 3000;
var POLICYHOLDER_DETAILS_LOADING_DURATION_MS = 3000;
var LOG_IN_THROUGH_THE_GOSUSLUGI_LOADING_DURATION_MS = 3000;
var CREATING_LOGIN_PASSWORD_LOADING_DURATION_MS = 3000;
var FINAL_LOADING_DURATION_MS = 7000;
var REGISTRATION_STEP_LOADING_DURATION_MS = 3000;

function getBrowserThemeMode() {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
}

function cloneProps(props) {
  return Object.assign({}, props);
}

function clearClassName(props) {
  var resolvedProps = cloneProps(props);
  var className = resolvedProps.className;

  delete resolvedProps.className;

  return {
    className: className,
    props: resolvedProps
  };
}

function hasDraftValue(draft, key) {
  return draft != null && Object.prototype.hasOwnProperty.call(draft, key);
}

function getDraftValue(draft, key, fallback) {
  return hasDraftValue(draft, key) ? draft[key] : fallback;
}

function AuthenticationPrototype(props) {
  var authenticationProps = props.authenticationProps;
  var className = props.className;
  var creatingLoginPasswordProps = props.creatingLoginPasswordProps;
  var dataId = props.dataId;
  var emailCodeProps = props.emailCodeProps;
  var policyholderDetailsProps = props.policyholderDetailsProps;
  var registrationProps = props.registrationProps;
  var restoringAccessProps = props.restoringAccessProps;
  var textMessageCodeProps = props.textMessageCodeProps;

  var rootProps = cloneProps(props);
  delete rootProps.authenticationProps;
  delete rootProps.className;
  delete rootProps.creatingLoginPasswordProps;
  delete rootProps.dataId;
  delete rootProps.emailCodeProps;
  delete rootProps.policyholderDetailsProps;
  delete rootProps.registrationProps;
  delete rootProps.restoringAccessProps;
  delete rootProps.textMessageCodeProps;

  var authentication = clearClassName(authenticationProps);
  var resolvedAuthenticationProps = authentication.props;
  var authenticationClassName = authentication.className;
  var onForgotCredentials = resolvedAuthenticationProps.onForgotCredentials;
  var onRegister = resolvedAuthenticationProps.onRegister;
  var authenticationThemeProps = resolvedAuthenticationProps.themeProps;
  delete resolvedAuthenticationProps.onForgotCredentials;
  delete resolvedAuthenticationProps.onRegister;
  delete resolvedAuthenticationProps.themeProps;

  var restoringAccess = clearClassName(restoringAccessProps);
  var resolvedRestoringAccessProps = restoringAccess.props;
  var restoringClassName = restoringAccess.className;

  var registration = clearClassName(registrationProps);
  var resolvedRegistrationProps = registration.props;
  var registrationClassName = registration.className;

  var textMessageCode = clearClassName(textMessageCodeProps);
  var resolvedTextMessageCodeProps = textMessageCode.props;
  var textMessageCodeClassName = textMessageCode.className;

  var creatingLoginPassword = clearClassName(creatingLoginPasswordProps);
  var resolvedCreatingLoginPasswordProps = creatingLoginPassword.props;
  var creatingLoginPasswordClassName = creatingLoginPassword.className;

  var emailCode = clearClassName(emailCodeProps);
  var resolvedEmailCodeProps = emailCode.props;
  var emailCodeClassName = emailCode.className;

  var policyholderDetails = clearClassName(policyholderDetailsProps);
  var resolvedPolicyholderDetailsProps = policyholderDetails.props;
  var policyholderDetailsClassName = policyholderDetails.className;

  var modeState = useState(getBrowserThemeMode);
  var mode = modeState[0];
  var setMode = modeState[1];

  var stepState = useState('first-screen');
  var step = stepState[0];
  var setStep = stepState[1];

  var clientTypeState = useState('individual');
  var clientType = clientTypeState[0];
  var setClientType = clientTypeState[1];

  var restoringFlowState = useState('password');
  var restoringFlow = restoringFlowState[0];
  var setRestoringFlow = restoringFlowState[1];

  var restoringMethodState = useState('email');
  var restoringMethod = restoringMethodState[0];
  var setRestoringMethod = restoringMethodState[1];

  var registrationMethodState = useState('email');
  var registrationMethod = registrationMethodState[0];
  var setRegistrationMethod = registrationMethodState[1];

  var restoringAccessDraftState = useState(null);
  var restoringAccessDraft = restoringAccessDraftState[0];
  var setRestoringAccessDraft = restoringAccessDraftState[1];

  var restoringLoginDraftState = useState(null);
  var restoringLoginDraft = restoringLoginDraftState[0];
  var setRestoringLoginDraft = restoringLoginDraftState[1];

  var registrationDraftState = useState(null);
  var registrationDraft = registrationDraftState[0];
  var setRegistrationDraft = registrationDraftState[1];

  var firstScreenDraftState = useState(null);
  var firstScreenDraft = firstScreenDraftState[0];
  var setFirstScreenDraft = firstScreenDraftState[1];

  var submittedPhoneNumberState = useState('');
  var submittedPhoneNumber = submittedPhoneNumberState[0];
  var setSubmittedPhoneNumber = submittedPhoneNumberState[1];

  var policyholderDetailsDraftState = useState(null);
  var policyholderDetailsDraft = policyholderDetailsDraftState[0];
  var setPolicyholderDetailsDraft = policyholderDetailsDraftState[1];

  var credentialCreationModeState = useState('password');
  var credentialCreationMode = credentialCreationModeState[0];
  var setCredentialCreationMode = credentialCreationModeState[1];

  var isCookiesVisibleState = useState(false);
  var isCookiesVisible = isCookiesVisibleState[0];
  var setIsCookiesVisible = isCookiesVisibleState[1];

  var isMobileViewportState = useState(function () {
    return typeof window !== 'undefined' && window.innerWidth <= COOKIES_XS_BREAKPOINT;
  });
  var isMobileViewport = isMobileViewportState[0];
  var setIsMobileViewport = isMobileViewportState[1];

  var isCaptchaOpenState = useState(false);
  var isCaptchaOpen = isCaptchaOpenState[0];
  var setIsCaptchaOpen = isCaptchaOpenState[1];

  var captchaValueState = useState('');
  var captchaValue = captchaValueState[0];
  var setCaptchaValue = captchaValueState[1];

  var isTimeoutOpenState = useState(false);
  var isTimeoutOpen = isTimeoutOpenState[0];
  var setIsTimeoutOpen = isTimeoutOpenState[1];

  var successfulToastKeyState = useState(0);
  var successfulToastKey = successfulToastKeyState[0];
  var setSuccessfulToastKey = successfulToastKeyState[1];

  var userWasNotFoundToastKeyState = useState(0);
  var userWasNotFoundToastKey = userWasNotFoundToastKeyState[0];
  var setUserWasNotFoundToastKey = userWasNotFoundToastKeyState[1];

  var loadingState = useState({
    captcha: false,
    codeCheck: false,
    corporateLogin: false,
    creatingLoginPassword: false,
    final: false,
    initial: true,
    logInThroughTheGosuslugi: false,
    phoneLogin: false,
    policyholderDetails: false,
    proofOfIdentity: false,
    registration: false,
    restoringAccess: false,
    step: false
  });
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var timersRef = useRef({});
  var isLoadingScreen = loading.initial || loading.final || loading.step;
  var dataIdValue = dataId || rootProps['data-id'];
  var device = 'auto';
  var sharedThemeProps = {
    applyToDocument: false,
    mode: mode,
    onModeChange: setMode
  };

  function setLoadingFlag(name, value) {
    setLoading(function (currentLoading) {
      var nextLoading = Object.assign({}, currentLoading);
      nextLoading[name] = value;
      return nextLoading;
    });
  }

  function clearTimer(name) {
    if (timersRef.current[name] != null) {
      window.clearTimeout(timersRef.current[name]);
      timersRef.current[name] = null;
    }
  }

  function clearAllTimers() {
    Object.keys(timersRef.current).forEach(function (name) {
      clearTimer(name);
    });
  }

  function startTimer(name, duration, onComplete) {
    clearTimer(name);
    timersRef.current[name] = window.setTimeout(function () {
      timersRef.current[name] = null;
      onComplete();
    }, duration);
  }

  function startCodeCheckTimer(onComplete) {
    setLoadingFlag('codeCheck', true);
    startTimer('codeCheck', CODE_CHECK_LOADING_DURATION_MS, function () {
      setLoadingFlag('codeCheck', false);
      onComplete();
    });
  }

  function patchFirstScreenDraft(patch) {
    setFirstScreenDraft(function (currentDraft) {
      return Object.assign({}, currentDraft, patch);
    });
  }

  function getDraftingInputProps(inputProps, draftKey) {
    return Object.assign({}, inputProps, {
      onValueChange: function (nextValue) {
        var nextDraft = {};
        nextDraft[draftKey] = nextValue;
        patchFirstScreenDraft(nextDraft);

        if (inputProps && inputProps.onValueChange) {
          inputProps.onValueChange(nextValue);
        }
      }
    });
  }

  function getFirstScreenConsentCheckboxProps() {
    var consentCheckboxProps = resolvedAuthenticationProps.consentCheckboxProps;

    return Object.assign({}, consentCheckboxProps, {
      onChange: function (event) {
        patchFirstScreenDraft({ consentAccepted: event.target.checked });

        if (consentCheckboxProps && consentCheckboxProps.onChange) {
          consentCheckboxProps.onChange(event);
        }
      }
    });
  }

  function getFirstScreenDefaultProps() {
    return {
      defaultConsentAccepted: getDraftValue(
        firstScreenDraft,
        'consentAccepted',
        resolvedAuthenticationProps.defaultConsentAccepted
      ),
      defaultLogin: getDraftValue(
        firstScreenDraft,
        'login',
        resolvedAuthenticationProps.defaultLogin
      ),
      defaultPassword: getDraftValue(
        firstScreenDraft,
        'password',
        resolvedAuthenticationProps.defaultPassword
      ),
      defaultPhone: getDraftValue(
        firstScreenDraft,
        'phone',
        resolvedAuthenticationProps.defaultPhone
      )
    };
  }

  function getRegistrationDefaultProps() {
    return {
      defaultConsentAccepted: getDraftValue(
        registrationDraft,
        'consentAccepted',
        resolvedRegistrationProps.defaultConsentAccepted
      ),
      defaultInn: getDraftValue(
        registrationDraft,
        'inn',
        resolvedRegistrationProps.defaultInn
      ),
      defaultMethod: getDraftValue(
        registrationDraft,
        'method',
        resolvedRegistrationProps.defaultMethod
      ),
      defaultValue: getDraftValue(
        registrationDraft,
        'value',
        resolvedRegistrationProps.defaultValue
      )
    };
  }

  function getRestoringAccessDefaultProps() {
    return {
      defaultConsentAccepted: getDraftValue(
        restoringLoginDraft,
        'consentAccepted',
        resolvedRestoringAccessProps.defaultConsentAccepted
      ),
      defaultInn: getDraftValue(
        restoringLoginDraft,
        'inn',
        resolvedRestoringAccessProps.defaultInn
      ),
      defaultLogin: getDraftValue(
        restoringAccessDraft,
        'login',
        resolvedRestoringAccessProps.defaultLogin
      ),
      defaultLoginMethod: getDraftValue(
        restoringLoginDraft,
        'method',
        resolvedRestoringAccessProps.defaultLoginMethod
      ),
      defaultRestoringFlow: restoringFlow,
      defaultRestoringValue: getDraftValue(
        restoringLoginDraft,
        'value',
        resolvedRestoringAccessProps.defaultRestoringValue
      )
    };
  }

  useEffect(function () {
    var timeoutId = window.setTimeout(function () {
      setLoadingFlag('initial', false);
      setIsCookiesVisible(true);
    }, INITIAL_LOADING_DURATION_MS);

    return function () {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(function () {
    if (typeof window === 'undefined') {
      return undefined;
    }

    function handleResize() {
      setIsMobileViewport(window.innerWidth <= COOKIES_XS_BREAKPOINT);
    }

    window.addEventListener('resize', handleResize);

    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(function () {
    if (!loading.final) {
      return undefined;
    }

    var timeoutId = window.setTimeout(function () {
    setLoadingFlag('final', false);
    setStep('first-screen');
    setClientType('individual');
    setFirstScreenDraft(null);
    setSubmittedPhoneNumber('');
    setRegistrationDraft(null);
    setRestoringAccessDraft(null);
    setRestoringLoginDraft(null);
    setPolicyholderDetailsDraft(null);
    setCredentialCreationMode('password');
  }, FINAL_LOADING_DURATION_MS);

    return function () {
      window.clearTimeout(timeoutId);
    };
  }, [loading.final]);

  useEffect(function () {
    return clearAllTimers;
  }, []);

  function resetFlowState(options) {
    var resolvedOptions = options || {};

    clearAllTimers();
    setStep('first-screen');
    setClientType('individual');
    setLoading({
      captcha: false,
      codeCheck: false,
      corporateLogin: false,
      creatingLoginPassword: false,
      final: false,
      initial: false,
      logInThroughTheGosuslugi: false,
      phoneLogin: false,
      policyholderDetails: false,
      proofOfIdentity: false,
      registration: false,
      restoringAccess: false,
      step: false
    });
    setIsCaptchaOpen(false);
    setCaptchaValue('');
    setIsTimeoutOpen(false);
    setSubmittedPhoneNumber('');
    if (!resolvedOptions.preserveFirstScreenDraft) {
      setFirstScreenDraft(null);
    }
    setRegistrationDraft(null);
    setRestoringAccessDraft(null);
    setRestoringLoginDraft(null);
    setPolicyholderDetailsDraft(null);
    setCredentialCreationMode('password');
  }

  function handleBackToFirstScreen() {
    resetFlowState({ preserveFirstScreenDraft: true });
  }

  function handleLogoClick() {
    resetFlowState();
  }

  function normalizePhoneNumber(value) {
    var digits = String(value || '').replace(/\D/g, '');

    return digits.length === 10 ? '7' + digits : digits;
  }

  function formatPhoneNumber(value) {
    var digits = normalizePhoneNumber(value);
    var localDigits = digits.length === 11 && digits[0] === '7' ? digits.slice(1) : digits;

    if (localDigits.length !== 10) {
      return value;
    }

    return '+7 (' + localDigits.slice(0, 3) + ') ' + localDigits.slice(3, 6) + '-' + localDigits.slice(6, 8) + '-' + localDigits.slice(8, 10);
  }

  function formatHiddenPhoneNumber() {
    return '+7 (***) ***-99-99';
  }

  function formatHiddenEmail(value) {
    var trimmedValue = String(value || '').trim().toLowerCase();
    var parts = trimmedValue.split('@');
    var localPart = parts[0] || '';
    var domainPart = parts[1] || '';

    if (!localPart || !domainPart) {
      return 's******i@r*****s.ru';
    }

    var maskedLocalPart =
      localPart.length <= 2
        ? (localPart[0] || '*') + '*'
        : localPart[0] + new Array(Math.max(localPart.length - 2, 1) + 1).join('*') + localPart[localPart.length - 1];
    var maskedDomain =
      domainPart.length <= 2
        ? (domainPart[0] || '*') + '*'
        : domainPart[0] + new Array(Math.max(domainPart.length - 2, 1) + 1).join('*') + domainPart[domainPart.length - 1];

    return maskedLocalPart + '@' + maskedDomain;
  }

  function openTextMessageCodeStep() {
    setStep('text-message-code-show-with-email');
  }

  function openHiddenEmailCodeStep() {
    setStep('email-code-hidden');
  }

  function openRestoringEmailCodeStep() {
    setStep('restoring-email-code-hidden');
  }

  function openRestoringPhoneCodeStep() {
    setStep('restoring-phone-code-hidden');
  }

  function openCreatingLoginPasswordStep() {
    setStep('creating-login-password');
  }

  function handleIndividualSubmit(payload) {
    if (resolvedAuthenticationProps.onIndividualSubmit) {
      resolvedAuthenticationProps.onIndividualSubmit(payload);
    }

    var normalizedPhoneNumber = normalizePhoneNumber(payload.phone);
    patchFirstScreenDraft({
      consentAccepted: payload.consentAccepted,
      phone: payload.phone
    });
    setSubmittedPhoneNumber(normalizedPhoneNumber);
    setLoadingFlag('phoneLogin', true);

    startTimer('phoneLogin', PHONE_LOGIN_LOADING_DURATION_MS, function () {
      setLoadingFlag('phoneLogin', false);

      if (normalizedPhoneNumber === CAPTCHA_PHONE_NUMBER) {
        setCaptchaValue('');
        setIsCaptchaOpen(true);
        return;
      }

      if (PROOF_OF_IDENTITY_PHONE_NUMBERS.has(normalizedPhoneNumber)) {
        setStep('proof-of-identity');
        return;
      }

      openTextMessageCodeStep();
    });
  }

  function handleCaptchaClose() {
    clearTimer('captcha');
    setIsCaptchaOpen(false);
    setCaptchaValue('');
    setLoadingFlag('captcha', false);
  }

  function handleCaptchaContinue() {
    setLoadingFlag('captcha', true);

    startTimer('captcha', PHONE_LOGIN_LOADING_DURATION_MS, function () {
      setLoadingFlag('captcha', false);
      setIsCaptchaOpen(false);

      if (String(captchaValue).trim().toLowerCase() === CAPTCHA_TIMEOUT_VALUE) {
        setCaptchaValue('');
        setIsTimeoutOpen(true);
        return;
      }

      openTextMessageCodeStep();
    });
  }

  function handleProofOfIdentityContinue() {
    setLoadingFlag('proofOfIdentity', true);

    startTimer('proofOfIdentity', PHONE_LOGIN_LOADING_DURATION_MS, function () {
      setLoadingFlag('proofOfIdentity', false);
      openTextMessageCodeStep();
    });
  }

  function handleCorporateSubmit(payload) {
    if (resolvedAuthenticationProps.onCorporateSubmit) {
      resolvedAuthenticationProps.onCorporateSubmit(payload);
    }

    patchFirstScreenDraft({
      login: payload.login,
      password: payload.password
    });
    setLoadingFlag('corporateLogin', true);

    startTimer('corporateLogin', PHONE_LOGIN_LOADING_DURATION_MS, function () {
      setLoadingFlag('corporateLogin', false);

      if (
        String(payload.login || '').trim() === CORPORATE_SUCCESS_LOGIN &&
        String(payload.password || '').trim() === CORPORATE_SUCCESS_PASSWORD
      ) {
        setSuccessfulToastKey(function (currentKey) { return currentKey + 1; });
        setLoadingFlag('final', true);
        return;
      }

      setUserWasNotFoundToastKey(function (currentKey) { return currentKey + 1; });
    });
  }

  function handleRegistrationSubmit(payload) {
    if (resolvedRegistrationProps.onSubmit) {
      resolvedRegistrationProps.onSubmit(payload);
    }

    setRegistrationDraft(payload);
    setRegistrationMethod(payload.method);
    setLoadingFlag('registration', true);

    startTimer('registration', REGISTRATION_STEP_LOADING_DURATION_MS, function () {
      setLoadingFlag('registration', false);
      setStep(
        payload.method === 'phone'
          ? 'registration-phone-confirmation'
          : 'registration-email-confirmation'
      );
    });
  }

  function handleCodeComplete() {
    startCodeCheckTimer(function () {
      if (REGISTRATION_SKIPPED_PHONE_NUMBERS.has(submittedPhoneNumber)) {
        setSuccessfulToastKey(function (currentKey) { return currentKey + 1; });
        setLoadingFlag('final', true);
        return;
      }

      setStep('policyholder-details');
    });
  }

  function handleRestoringAccessSubmit(payload) {
    if (resolvedRestoringAccessProps.onPasswordSubmit) {
      resolvedRestoringAccessProps.onPasswordSubmit(payload);
    }

    setRestoringAccessDraft(payload);
    setLoadingFlag('restoringAccess', true);

    startTimer('restoringAccess', RESTORING_ACCESS_LOADING_DURATION_MS, function () {
      var normalizedValue = String(payload.login || '').trim().toLowerCase();
      var phoneDigits = normalizedValue.replace(/\D/g, '');
      var isPhoneValue =
        normalizedValue === 'phone' ||
        phoneDigits.length === 10 ||
        phoneDigits.length === 11;
      var isEmailValue =
        normalizedValue === 'email' ||
        normalizedValue.indexOf('@') !== -1;

      setLoadingFlag('restoringAccess', false);

      if (isPhoneValue) {
        openRestoringPhoneCodeStep();
        return;
      }

      if (isEmailValue) {
        openRestoringEmailCodeStep();
        return;
      }

      setUserWasNotFoundToastKey(function (currentKey) { return currentKey + 1; });
    });
  }

  function handleRestoringLoginSubmit(payload) {
    if (resolvedRestoringAccessProps.onRestoringLoginSubmit) {
      resolvedRestoringAccessProps.onRestoringLoginSubmit(payload);
    }

    setRestoringLoginDraft(payload);
    setLoadingFlag('restoringAccess', true);

    startTimer('restoringAccess', RESTORING_ACCESS_LOADING_DURATION_MS, function () {
      setLoadingFlag('restoringAccess', false);
      setStep(
        payload.method === 'phone'
          ? 'restoring-phone-code-visible'
          : 'restoring-email-code-visible'
      );
    });
  }

  function handleRestoringCodeComplete() {
    startCodeCheckTimer(function () {
      setCredentialCreationMode('password');
      openCreatingLoginPasswordStep();
    });
  }

  function handleRestoringLoginCodeComplete() {
    startCodeCheckTimer(function () {
      setCredentialCreationMode('login');
      openCreatingLoginPasswordStep();
    });
  }

  function handleRegistrationCodeComplete() {
    startCodeCheckTimer(function () {
      setCredentialCreationMode('login-and-password');
      openCreatingLoginPasswordStep();
    });
  }

  function handleCreatingLoginPasswordSubmit(payload) {
    if (resolvedCreatingLoginPasswordProps.onSubmit) {
      resolvedCreatingLoginPasswordProps.onSubmit(payload);
    }

    setLoadingFlag('creatingLoginPassword', true);

    startTimer('creatingLoginPassword', CREATING_LOGIN_PASSWORD_LOADING_DURATION_MS, function () {
      setLoadingFlag('creatingLoginPassword', false);
      setSuccessfulToastKey(function (currentKey) { return currentKey + 1; });
      setLoadingFlag('final', true);
      setRestoringLoginDraft(null);
      setCredentialCreationMode('password');
    });
  }

  function handlePolicyholderDetailsSubmit() {
    setLoadingFlag('policyholderDetails', true);

    startTimer('policyholderDetails', POLICYHOLDER_DETAILS_LOADING_DURATION_MS, function () {
      setLoadingFlag('policyholderDetails', false);
      setSuccessfulToastKey(function (currentKey) { return currentKey + 1; });
      setLoadingFlag('final', true);
    });
  }

  function handlePolicyholderDetailsFlow(payload) {
    setPolicyholderDetailsDraft(payload);

    if (String(payload.email || '').trim().toLowerCase() === LOG_IN_THROUGH_THE_GOSUSLUGI_EMAIL) {
      setLoadingFlag('logInThroughTheGosuslugi', true);

      startTimer('logInThroughTheGosuslugi', LOG_IN_THROUGH_THE_GOSUSLUGI_LOADING_DURATION_MS, function () {
        setLoadingFlag('logInThroughTheGosuslugi', false);
        setStep('log-in-through-the-gosuslugi');
      });
      return;
    }

    handlePolicyholderDetailsSubmit();
  }

  function getHomeBrandButtonProps(brandButtonProps) {
    return Object.assign({}, brandButtonProps, {
      onClick: function (event) {
        if (brandButtonProps && brandButtonProps.onClick) {
          brandButtonProps.onClick(event);
        }

        if (!event.defaultPrevented) {
          handleLogoClick();
        }
      }
    });
  }

  function getPolicyholderDetailsDefaultProps() {
    return {
      defaultBirthDate: policyholderDetailsDraft ? policyholderDetailsDraft.birthDate : undefined,
      defaultConsentAccepted:
        policyholderDetailsDraft
          ? policyholderDetailsDraft.consentAccepted
          : resolvedPolicyholderDetailsProps.defaultConsentAccepted,
      defaultEmail:
        policyholderDetailsDraft
          ? policyholderDetailsDraft.email
          : resolvedPolicyholderDetailsProps.defaultEmail,
      defaultGender:
        policyholderDetailsDraft
          ? policyholderDetailsDraft.gender
          : resolvedPolicyholderDetailsProps.defaultGender,
      defaultMiddleName:
        policyholderDetailsDraft
          ? policyholderDetailsDraft.middleName
          : resolvedPolicyholderDetailsProps.defaultMiddleName,
      defaultName:
        policyholderDetailsDraft
          ? policyholderDetailsDraft.name
          : resolvedPolicyholderDetailsProps.defaultName,
      defaultSurname:
        policyholderDetailsDraft
          ? policyholderDetailsDraft.surname
          : resolvedPolicyholderDetailsProps.defaultSurname,
      defaultWithoutMiddleName:
        policyholderDetailsDraft
          ? policyholderDetailsDraft.withoutMiddleName
          : resolvedPolicyholderDetailsProps.defaultWithoutMiddleName
    };
  }

  function renderPolicyholderDetailsTemplate() {
    return (
      <AuthenticationRegistrationData
        {...resolvedPolicyholderDetailsProps}
        {...getPolicyholderDetailsDefaultProps()}
        brandButtonProps={getHomeBrandButtonProps(
          resolvedPolicyholderDetailsProps.brandButtonProps
        )}
        className={classNames(
          'rshb-authentication-prototype__template',
          policyholderDetailsClassName
        )}
        device={device}
        onSubmit={function (payload) {
          if (resolvedPolicyholderDetailsProps.onSubmit) {
            resolvedPolicyholderDetailsProps.onSubmit(payload);
          }
          handlePolicyholderDetailsFlow(payload);
        }}
        saveButtonProps={Object.assign(
          {},
          resolvedPolicyholderDetailsProps.saveButtonProps,
          {
            loading:
              loading.logInThroughTheGosuslugi ||
              loading.policyholderDetails ||
              Boolean(resolvedPolicyholderDetailsProps.saveButtonProps && resolvedPolicyholderDetailsProps.saveButtonProps.loading)
          }
        )}
        themeProps={sharedThemeProps}
      />
    );
  }

  function renderEmailConfirmationStep(configuration) {
    return (
      <AuthenticationEmailConfirmation
        {...resolvedEmailCodeProps}
        brandButtonProps={getHomeBrandButtonProps(
          resolvedEmailCodeProps.brandButtonProps
        )}
        className={classNames(
          'rshb-authentication-prototype__template',
          emailCodeClassName
        )}
        codeInputProps={Object.assign(
          {},
          resolvedEmailCodeProps.codeInputProps,
          {
            completionBehavior: 'reset',
            loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
            onComplete: function (code) {
              if (resolvedEmailCodeProps.codeInputProps && resolvedEmailCodeProps.codeInputProps.onComplete) {
                resolvedEmailCodeProps.codeInputProps.onComplete(code);
              }
              configuration.onComplete();
            }
          }
        )}
        device={device}
        email={configuration.email}
        emailMode={configuration.emailMode}
        hiddenEmail={configuration.hiddenEmail}
        onChangeEmail={configuration.onChangeEmail}
        themeProps={sharedThemeProps}
      />
    );
  }

  function renderPhoneConfirmationStep(configuration) {
    return (
      <AuthenticationPhoneConfirmation
        {...resolvedTextMessageCodeProps}
        brandButtonProps={getHomeBrandButtonProps(
          resolvedTextMessageCodeProps.brandButtonProps
        )}
        className={classNames(
          'rshb-authentication-prototype__template',
          textMessageCodeClassName
        )}
        codeInputProps={Object.assign(
          {},
          resolvedTextMessageCodeProps.codeInputProps,
          {
            completionBehavior: 'reset',
            loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
            onComplete: function (code) {
              if (resolvedTextMessageCodeProps.codeInputProps && resolvedTextMessageCodeProps.codeInputProps.onComplete) {
                resolvedTextMessageCodeProps.codeInputProps.onComplete(code);
              }
              configuration.onComplete();
            }
          }
        )}
        device={device}
        hiddenPhoneNumber={configuration.hiddenPhoneNumber}
        onChangePhone={configuration.onChangePhone}
        onRequestEmailCode={configuration.onRequestEmailCode}
        phoneMode={configuration.phoneMode}
        phoneNumber={configuration.phoneNumber}
        showEmailButton={configuration.showEmailButton}
        themeProps={sharedThemeProps}
      />
    );
  }

  function renderFirstScreen(overrides) {
    return (
      <AuthenticationFirstScreen
        {...resolvedAuthenticationProps}
        {...getFirstScreenDefaultProps()}
        {...overrides}
        brandButtonProps={getHomeBrandButtonProps(
          resolvedAuthenticationProps.brandButtonProps
        )}
        className={classNames(
          'rshb-authentication-prototype__template',
          authenticationClassName
        )}
        consentCheckboxProps={getFirstScreenConsentCheckboxProps()}
        clientType={clientType}
        device={device}
        loginInputProps={getDraftingInputProps(
          resolvedAuthenticationProps.loginInputProps,
          'login'
        )}
        onClientTypeChange={setClientType}
        onCorporateSubmit={handleCorporateSubmit}
        onForgotCredentials={function () {
          if (onForgotCredentials) { onForgotCredentials(); }
          setStep('restoring-access');
        }}
        onIndividualSubmit={handleIndividualSubmit}
        onRegister={function () {
          if (onRegister) { onRegister(); }
          setStep('registration-inn');
        }}
        passwordInputProps={getDraftingInputProps(
          resolvedAuthenticationProps.passwordInputProps,
          'password'
        )}
        phoneInputProps={getDraftingInputProps(
          resolvedAuthenticationProps.phoneInputProps,
          'phone'
        )}
        themeProps={Object.assign(
          {},
          authenticationThemeProps,
          sharedThemeProps
        )}
      />
    );
  }

  function renderStep() {
    if (step === 'policyholder-details') {
      return renderPolicyholderDetailsTemplate();
    }

    if (step === 'log-in-through-the-gosuslugi') {
      return (
        <React.Fragment>
          {renderPolicyholderDetailsTemplate()}
          <DialogModal
            closeOnPrimaryAction={false}
            closeOnTertiaryAction={false}
            onClose={function () { setStep('policyholder-details'); }}
            onPrimaryAction={function () { setStep('policyholder-details'); }}
            onTertiaryAction={function () { setStep('policyholder-details'); }}
            placement="top-center"
            template="log-in-through-the-gosuslugi"
          />
        </React.Fragment>
      );
    }

    if (step === 'email-code-hidden') {
      return renderEmailConfirmationStep({
        email: 'sample@rshbins.ru',
        emailMode: 'hidden',
        onComplete: handleCodeComplete
      });
    }

    if (step === 'registration-email-confirmation') {
      return renderEmailConfirmationStep({
        email: registrationDraft ? registrationDraft.value : '',
        emailMode: 'visible',
        onChangeEmail: function () { setStep('registration-inn'); },
        onComplete: handleRegistrationCodeComplete
      });
    }

    if (step === 'restoring-email-code-hidden') {
      return renderEmailConfirmationStep({
        email: restoringAccessDraft ? restoringAccessDraft.login : '',
        emailMode: 'hidden',
        hiddenEmail: formatHiddenEmail(restoringAccessDraft ? restoringAccessDraft.login : ''),
        onComplete: handleRestoringCodeComplete
      });
    }

    if (step === 'restoring-email-code-visible') {
      return renderEmailConfirmationStep({
        email: restoringLoginDraft ? restoringLoginDraft.value : '',
        emailMode: 'visible',
        onChangeEmail: function () { setStep('restoring-access'); },
        onComplete: handleRestoringLoginCodeComplete
      });
    }

    if (step === 'restoring-phone-code-hidden') {
      return renderPhoneConfirmationStep({
        hiddenPhoneNumber: formatHiddenPhoneNumber(),
        onComplete: handleRestoringCodeComplete,
        phoneMode: 'hidden',
        phoneNumber: formatPhoneNumber(restoringAccessDraft ? restoringAccessDraft.login : ''),
        showEmailButton: false
      });
    }

    if (step === 'restoring-phone-code-visible') {
      return renderPhoneConfirmationStep({
        onChangePhone: function () { setStep('restoring-access'); },
        onComplete: handleRestoringLoginCodeComplete,
        phoneNumber: formatPhoneNumber(restoringLoginDraft ? restoringLoginDraft.value : ''),
        showEmailButton: false
      });
    }

    if (step === 'creating-login-password') {
      return (
        <AuthenticationCreatingLoginPassword
          {...resolvedCreatingLoginPasswordProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedCreatingLoginPasswordProps.brandButtonProps
          )}
          className={classNames(
            'rshb-authentication-prototype__template',
            creatingLoginPasswordClassName
          )}
          defaultLogin={resolvedCreatingLoginPasswordProps.defaultLogin || ''}
          device={device}
          mode={credentialCreationMode}
          onSubmit={handleCreatingLoginPasswordSubmit}
          saveButtonProps={Object.assign(
            {},
            resolvedCreatingLoginPasswordProps.saveButtonProps,
            {
              loading:
                loading.creatingLoginPassword ||
                Boolean(resolvedCreatingLoginPasswordProps.saveButtonProps && resolvedCreatingLoginPasswordProps.saveButtonProps.loading)
            }
          )}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'proof-of-identity') {
      return (
        <React.Fragment>
          {renderFirstScreen({
            loginButtonProps: Object.assign(
              {},
              resolvedAuthenticationProps.loginButtonProps,
              { loading: false }
            )
          })}
          <DialogModal
            closeOnPrimaryAction={false}
            closeOnTertiaryAction={false}
            onClose={handleBackToFirstScreen}
            onPrimaryAction={handleProofOfIdentityContinue}
            onSecondaryAction={function () {}}
            onTertiaryAction={handleBackToFirstScreen}
            placement="top-center"
            primaryActionLoading={loading.proofOfIdentity}
            template="proof-of-identity"
          />
        </React.Fragment>
      );
    }

    if (step === 'text-message-code-show-with-email') {
      return renderPhoneConfirmationStep({
        onChangePhone: handleBackToFirstScreen,
        onComplete: handleCodeComplete,
        onRequestEmailCode: openHiddenEmailCodeStep,
        phoneNumber: formatPhoneNumber(submittedPhoneNumber),
        showEmailButton: REGISTRATION_SKIPPED_PHONE_NUMBERS.has(submittedPhoneNumber)
      });
    }

    if (step === 'registration-phone-confirmation') {
      return renderPhoneConfirmationStep({
        onChangePhone: function () { setStep('registration-inn'); },
        onComplete: handleRegistrationCodeComplete,
        phoneNumber: formatPhoneNumber(registrationDraft ? registrationDraft.value : ''),
        showEmailButton: false
      });
    }

    if (step === 'restoring-access') {
      return (
        <AuthenticationRestoringAccess
          {...resolvedRestoringAccessProps}
          {...getRestoringAccessDefaultProps()}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedRestoringAccessProps.brandButtonProps
          )}
          className={classNames(
            'rshb-authentication-prototype__template',
            restoringClassName
          )}
          device={device}
          loginMethod={restoringMethod}
          onBack={handleBackToFirstScreen}
          onLoginMethodChange={setRestoringMethod}
          onPasswordSubmit={handleRestoringAccessSubmit}
          onRestoringFlowChange={setRestoringFlow}
          onRestoringLoginSubmit={handleRestoringLoginSubmit}
          restoringFlow={restoringFlow}
          submitButtonProps={Object.assign(
            {},
            resolvedRestoringAccessProps.submitButtonProps,
            {
              loading:
                loading.restoringAccess ||
                Boolean(resolvedRestoringAccessProps.submitButtonProps && resolvedRestoringAccessProps.submitButtonProps.loading)
            }
          )}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'registration-inn') {
      return (
        <AuthenticationRegistration
          {...resolvedRegistrationProps}
          {...getRegistrationDefaultProps()}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedRegistrationProps.brandButtonProps
          )}
          className={classNames(
            'rshb-authentication-prototype__template',
            registrationClassName
          )}
          device={device}
          method={registrationMethod}
          onBack={handleBackToFirstScreen}
          onMethodChange={setRegistrationMethod}
          onSubmit={handleRegistrationSubmit}
          registerButtonProps={Object.assign(
            {},
            resolvedRegistrationProps.registerButtonProps,
            {
              loading:
                loading.registration ||
                Boolean(resolvedRegistrationProps.registerButtonProps && resolvedRegistrationProps.registerButtonProps.loading)
            }
          )}
          themeProps={sharedThemeProps}
        />
      );
    }

    return renderFirstScreen({
      loginButtonProps: Object.assign(
        {},
        resolvedAuthenticationProps.loginButtonProps,
        {
          loading:
            loading.phoneLogin ||
            loading.corporateLogin ||
            Boolean(resolvedAuthenticationProps.loginButtonProps && resolvedAuthenticationProps.loginButtonProps.loading)
        }
      )
    });
  }

  return (
    <div
      {...rootProps}
      className={classNames(
        'rshb-authentication-prototype',
        isLoadingScreen && 'rshb-authentication-prototype--loading',
        'theme-' + mode,
        className
      )}
      data-id={dataIdValue}
    >
      {isLoadingScreen ? (
        <div className="rshb-authentication-prototype__loading">
          <LoaderBrand />
        </div>
      ) : (
        renderStep()
      )}

      {isCaptchaOpen ? (
        <DialogModal
          captchaLabel="7K9B"
          closeOnPrimaryAction={false}
          closeOnTertiaryAction={false}
          inputProps={{
            onValueChange: setCaptchaValue,
            value: captchaValue
          }}
          onClose={handleCaptchaClose}
          onPrimaryAction={handleCaptchaContinue}
          onTertiaryAction={handleCaptchaClose}
          placement="top-center"
          primaryActionDisabled={!captchaValue || !captchaValue.trim()}
          primaryActionLoading={loading.captcha}
          template="captcha"
        />
      ) : null}

      {isTimeoutOpen ? (
        <DialogModal
          closeOnPrimaryAction={false}
          closeOnTertiaryAction={false}
          countdownDurationSeconds={30 * 60}
          onClose={function () { setIsTimeoutOpen(false); }}
          onPrimaryAction={function () {}}
          onTertiaryAction={function () { setIsTimeoutOpen(false); }}
          placement="top-center"
          template="timeout"
        />
      ) : null}

      {successfulToastKey > 0 ? (
        <DialogToast
          key={'successful-' + successfulToastKey}
          onClose={function () { setSuccessfulToastKey(0); }}
          placement="top-center"
          template="successful-authentication"
        />
      ) : null}

      {userWasNotFoundToastKey > 0 ? (
        <DialogToast
          key={'user-not-found-' + userWasNotFoundToastKey}
          onClose={function () { setUserWasNotFoundToastKey(0); }}
          placement="top-center"
          template="user-not-found"
        />
      ) : null}

      {isCookiesVisible ? (
        <Cookies
          onClose={function () { setIsCookiesVisible(false); }}
          placement="bottom-center"
          size={isMobileViewport ? 'xs' : 's'}
        />
      ) : null}
    </div>
  );
}

AuthenticationPrototype.displayName = 'AuthenticationPrototype';

AuthenticationPrototype.propTypes = {
  authenticationProps: PropTypes.object,
  className: PropTypes.string,
  creatingLoginPasswordProps: PropTypes.object,
  dataId: PropTypes.string,
  emailCodeProps: PropTypes.object,
  policyholderDetailsProps: PropTypes.object,
  registrationProps: PropTypes.object,
  restoringAccessProps: PropTypes.object,
  textMessageCodeProps: PropTypes.object
};

AuthenticationPrototype.defaultProps = {
  authenticationProps: undefined,
  className: undefined,
  creatingLoginPasswordProps: undefined,
  dataId: undefined,
  emailCodeProps: undefined,
  policyholderDetailsProps: undefined,
  registrationProps: undefined,
  restoringAccessProps: undefined,
  textMessageCodeProps: undefined
};

export default AuthenticationPrototype;
