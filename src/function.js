import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://mathereconomics.com/">
          Mather Economics
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
};

export default function Title(props) {
  return (
    <Typography component="h2" variant="h6" color="secondary" gutterBottom>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};

export { Copyright, Title }