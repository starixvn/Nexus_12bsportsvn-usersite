import React from 'react';
import { useNavigate } from 'react-router-dom';

const withNavigation = Component => props => <Component {...props} navigate={useNavigate()} />;

export default withNavigation;