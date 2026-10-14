import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
function DocumentIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
    >
      <path
        d="M5.25 1.75H10.3L14.25 5.7V15.5C14.25 15.9142 13.9142 16.25 13.5 16.25H5.25C4.42157 16.25 3.75 15.5784 3.75 14.75V3.25C3.75 2.42157 4.42157 1.75 5.25 1.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M10.25 1.75V5.75H14.25"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6.5 9.5H11.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M6.5 12.25H10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function DocumentLink({ href, title, fileSize, className, dataId, ...rest }) {
  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classNames('rshb-legacy-document-link', className)}
      data-id={dataId || rest['data-id']}
      title={typeof title === 'string' ? title : undefined}
    >
      <span aria-hidden="true" className="rshb-legacy-document-link__icon">
        <DocumentIcon />
      </span>
      <span className="rshb-legacy-document-link__copy">
        <span className="rshb-legacy-document-link__title">{title}</span>
        {fileSize ? (
          <span className="rshb-legacy-document-link__meta">{fileSize}</span>
        ) : null}
      </span>
    </a>
  );
}
DocumentLink.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  fileSize: PropTypes.string,
  className: PropTypes.string,
  dataId: PropTypes.string
};
export default DocumentLink;
