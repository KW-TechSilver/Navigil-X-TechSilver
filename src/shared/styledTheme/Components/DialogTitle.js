import React from 'react';
import { DialogTitle as MuiDialogTitle, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: () => ({
    margin: 0,
    paddingTop: theme.spacing(2),
  }),
  dense: () => ({
    margin: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  }),
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, dense, ...other } = props;
  return (
    <MuiDialogTitle
      disableTypography
      className={`${classes.root}${dense ? ` ${classes.dense}` : ''}`}
      {...other}
    >
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton aria-label='close' className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default DialogTitle;
