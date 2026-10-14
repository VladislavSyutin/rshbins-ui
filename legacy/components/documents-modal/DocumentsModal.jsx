import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Modal from '../modal/index.js';
import Button from '../button/index.js';
import Checkbox from '../checkbox/index.js';
import Spin from '../spin/index.js';
import chevronDownIcon from '../../icons/chevron-down.js';
import './styles.css';

const DocumentPage = React.memo(function DocumentPage(props) {
  const { page, label, onLoad, onError } = props;
  return (
    <div className="rshb-legacy-documents-modal__page" style={{ paddingBottom: (page.height / page.width * 100) + '%' }}>
      <img
        alt={label}
        className="rshb-legacy-documents-modal__page-image"
        decoding="async"
        onError={onError}
        onLoad={onLoad}
        src={page.src}
      />
      {page.text && page.text.length ? (
        <svg
          aria-label={label + ', текст'}
          className="rshb-legacy-documents-modal__text-layer"
          viewBox={'0 0 ' + page.width + ' ' + page.height}
        >
          {page.text.map(function (word, index) {
            return <text key={index} x={word.x} y={word.y + word.height * 0.8}
              fontSize={word.height} textLength={word.width} lengthAdjust="spacingAndGlyphs">{word.text + ' '}</text>;
          })}
        </svg>
      ) : null}
    </div>
  );
});

function DocumentsModal(props) {
  const {
    className, dataId, documents, heading = 'Ознакомьтесь с документами',
    onClose, onConfirm, placement = 'top-center', ...rest
  } = props;
  const scrollRef = useRef(null);
  const [pageStatus, setPageStatus] = useState({});
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [checked, setChecked] = useState(false);
  const confirmedRef = useRef(false);
  const pages = useMemo(function () {
    return documents.reduce(function (result, document) {
      return result.concat(document.pages.map(function (page, index) {
        return { page: page, id: document.id + '-' + index, label: document.title + ', страница ' + (index + 1) };
      }));
    }, []);
  }, [documents]);
  const allLoaded = pages.length > 0 && pages.every(function (entry) { return pageStatus[entry.id] === 'loaded'; });
  const hasError = pages.length === 0 || pages.some(function (entry) { return pageStatus[entry.id] === 'error'; });

  const updateProgress = useCallback(function () {
    const node = scrollRef.current;
    if (!node) return;
    const distance = Math.max(0, node.scrollHeight - node.clientHeight);
    const nextProgress = distance === 0 ? 1 : Math.min(1, node.scrollTop / distance);
    setProgress(nextProgress);
    // One CSS pixel allows for fractional layout/scroll offsets at the bottom.
    if (allLoaded && distance - node.scrollTop <= 1) setReachedEnd(true);
  }, [allLoaded]);

  const pageHandlers = useMemo(function () {
    return pages.map(function (entry) {
      function setStatus(status) {
        setPageStatus(function (current) {
          return Object.assign({}, current, { [entry.id]: status });
        });
      }
      return { onLoad: function () { setStatus('loaded'); }, onError: function () { setStatus('error'); } };
    });
  }, [pages, attempt]);

  useEffect(function () {
    updateProgress();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateProgress) : null;
    if (observer && scrollRef.current) observer.observe(scrollRef.current);
    window.addEventListener('resize', updateProgress);
    return function () {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', updateProgress);
    };
  }, [updateProgress]);

  useEffect(function () {
    if (placement !== 'top-center') return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (scrollRef.current) scrollRef.current.focus();
    return function () {
      document.body.style.overflow = previousOverflow;
      if (previousFocus && previousFocus.isConnected && previousFocus.focus) previousFocus.focus();
    };
  }, [placement]);

  function handleKeyDown(event) {
    if (rest.onKeyDown) rest.onKeyDown(event);
    if (event.defaultPrevented || event.key !== 'Tab' || placement !== 'top-center') return;
    const focusable = Array.from(event.currentTarget.querySelectorAll('button:not(:disabled), input:not(:disabled), [tabindex="0"]'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function retry() {
    setPageStatus({});
    setReachedEnd(false);
    setChecked(false);
    setAttempt(function (value) { return value + 1; });
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setProgress(0);
  }

  const canConfirm = allLoaded && reachedEnd && checked;
  return (
    <Modal
      {...rest}
      actions={function (context) {
        return (
          <div className="rshb-legacy-documents-modal__footer">
            <Checkbox
              checked={checked}
              dataId={dataId ? dataId + '-checkbox' : undefined}
              disabled={!allLoaded || !reachedEnd}
              label="Ознакомился (-ась) с документами"
              onChange={function (event) { setChecked(event.target.checked); }}
              size="s"
            />
            <div className="rshb-legacy-documents-modal__actions">
              <Button buttonType="secondary" size="s" dataId={dataId ? dataId + '-close' : undefined} onClick={context.requestClose}>Закрыть</Button>
              <Button size="s" dataId={dataId ? dataId + '-confirm' : undefined} disabled={!canConfirm}
                onClick={function () {
                  if (!canConfirm || confirmedRef.current) return;
                  confirmedRef.current = true;
                  if (onConfirm) onConfirm();
                  context.requestClose();
                }}>Ознакомился (-ась)</Button>
            </div>
          </div>
        );
      }}
      className={classNames('rshb-legacy-documents-modal', className)}
      dataId={dataId || rest['data-id']}
      description={null}
      heading={heading}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      placement={placement}
    >
      <div className="rshb-legacy-documents-modal__viewer">
        <div aria-busy={!allLoaded && !hasError} aria-label="Документы для ознакомления"
          className="rshb-legacy-documents-modal__scroll" onScroll={updateProgress} ref={scrollRef} role="region" tabIndex={0}>
          {pages.map(function (entry, index) {
            return <DocumentPage key={entry.id + '-' + attempt} page={entry.page} label={entry.label}
              onLoad={pageHandlers[index].onLoad} onError={pageHandlers[index].onError} />;
          })}
        </div>
        {!allLoaded ? (
          <div className="rshb-legacy-documents-modal__status" role={hasError ? 'alert' : 'status'}>
            {hasError ? <>
              <p>Не удалось загрузить документы. Повторите загрузку.</p>
              <Button buttonType="secondary" dataId={dataId ? dataId + '-retry' : undefined} onClick={retry}>Повторить загрузку</Button>
            </> : <><Spin size="m" label="Загрузка документов" /><p>Загружаем документы…</p></>}
          </div>
        ) : null}
        {allLoaded && progress >= 0.05 && !reachedEnd ? (
          <Button aria-label="Прокрутить документы до конца" buttonType="primary" size="s"
            className="rshb-legacy-documents-modal__scroll-to-end" iconOnly
            dataId={dataId ? dataId + '-scroll-to-end' : undefined}
            leadingIcon={<span aria-hidden="true" className="rshb-legacy-documents-modal__arrow" style={{ '--documents-arrow': 'url("' + chevronDownIcon + '")' }} />}
            onClick={function () {
              const node = scrollRef.current;
              if (node) {
                node.scrollTop = node.scrollHeight;
                updateProgress();
              }
            }} />
        ) : null}
      </div>
    </Modal>
  );
}

DocumentsModal.displayName = 'DocumentsModal';
DocumentsModal.propTypes = {
  className: PropTypes.string,
  dataId: PropTypes.string,
  documents: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    pages: PropTypes.arrayOf(PropTypes.shape({
      src: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      text: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired, y: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired, height: PropTypes.number.isRequired
      }))
    })).isRequired
  })).isRequired,
  heading: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  placement: PropTypes.oneOf(['inline', 'top-center'])
};
export default DocumentsModal;
