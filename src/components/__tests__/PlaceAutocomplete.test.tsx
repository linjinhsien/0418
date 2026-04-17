import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PlaceAutocomplete } from '../PlaceAutocomplete';

// 模擬 @vis.gl/react-google-maps
vi.mock('@vis.gl/react-google-maps', () => ({
  useMapsLibrary: vi.fn().mockReturnValue({
    Autocomplete: class {
      addListener = vi.fn((event, cb) => {
        // 保存回呼以便稍後手動觸發
        (window as any)._triggerPlaceChanged = cb;
      });
      getPlace = vi.fn().mockReturnValue({ name: '測試岩場', formatted_address: '台北市某處' });
    }
  }),
}));

describe('PlaceAutocomplete', () => {
  it('應該在輸入文字時更新狀態', () => {
    const onSelect = vi.fn();
    render(<PlaceAutocomplete onPlaceSelect={onSelect} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '原岩' } });
    
    expect(input.value).toBe('原岩');
  });

  it('當失去焦點時應該觸發 onPlaceSelect', () => {
    const onSelect = vi.fn();
    render(<PlaceAutocomplete onPlaceSelect={onSelect} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '原岩' } });
    fireEvent.blur(input);
    
    expect(onSelect).toHaveBeenCalledWith('原岩');
  });
});
