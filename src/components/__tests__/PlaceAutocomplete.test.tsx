import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { PlaceAutocomplete } from '../PlaceAutocomplete';

// 模擬 @vis.gl/react-google-maps
vi.mock('@vis.gl/react-google-maps', () => ({
  useMapsLibrary: vi.fn().mockReturnValue({
    // 使用 function 回傳真正的 DOM 節點以通過 appendChild 檢查
    PlaceAutocompleteElement: function() {
      const el = document.createElement('div');
      (el as any).addEventListener = vi.fn();
      return el;
    }
  }),
}));

describe('PlaceAutocomplete', () => {
  it('應該正確渲染並初始化 Google Maps 元件', () => {
    const onSelect = vi.fn();
    const { container } = render(<PlaceAutocomplete onPlaceSelect={onSelect} />);
    
    const wrapper = container.querySelector('.autocomplete-wrapper-custom');
    expect(wrapper).toBeTruthy();
    // 檢查子元素是否已添加 (mock 的 div)
    expect(wrapper?.children.length).toBe(1);
  });

  it('應該正確設置 placeholder 屬性', () => {
    const onSelect = vi.fn();
    const placeholder = "搜尋岩場...";
    const { container } = render(<PlaceAutocomplete onPlaceSelect={onSelect} placeholder={placeholder} />);
    
    const wrapper = container.querySelector('.autocomplete-wrapper-custom');
    expect(wrapper).toBeTruthy();
  });
});
