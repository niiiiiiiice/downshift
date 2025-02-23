import styled from "styled-components";

export const Label = styled.div`
  flex: 1;
  overflow: hidden;
  line-height: 1.4;
`;

export const ExpandIconWrapper = styled.div`
  display: inline-flex;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  user-select: none;
  color: #999;
  flex-shrink: 0;
  margin-left: -4px;
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    color: #666;
    background-color: rgba(0, 0, 0, 0.05);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
  right: 12px;
  background: inherit;
  padding-left: 12px;
  height: 100%;
  align-items: center;
`;

export const ActionButton = styled.button`
  padding: 4px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  height: 24px;

  &:hover {
    background: #E6F7FF;
    color: #1890ff;
  }

  span {
    font-size: 14px;
  }
`;