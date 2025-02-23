import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Input } from 'antd';
import type { InputRef } from 'antd';

// Базовый styled input
const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

// Custom styled input
export const CustomInput = forwardRef<HTMLInputElement>((props, ref) => (
  <StyledInput ref={ref} {...props} />
));

// Material styled input
const MaterialStyledInput = styled(StyledInput)`
  border: none;
  border-bottom: 2px solid #ccc;
  border-radius: 0;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #1976d2;
    box-shadow: none;
  }
`;

export const MaterialInput = forwardRef<HTMLInputElement>((props, ref) => (
  <MaterialStyledInput ref={ref} {...props} />
));

// Dark styled input
const DarkStyledInput = styled(StyledInput)`
  background: #1f1f1f;
  color: #fff;
  border-color: #333;
  
  &:focus {
    border-color: #666;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }
`;

export const DarkInput = forwardRef<HTMLInputElement>((props, ref) => (
  <DarkStyledInput ref={ref} {...props} />
));