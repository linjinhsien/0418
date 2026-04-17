
import { feloSearchService } from './src/suggestions/feloSearchService';

async function testFeloSearch() {
  console.log('正在測試 Felo Search 整合...');
  const result = await feloSearchService.search('最新的抱石 V5 訓練建議');
  if (result) {
    console.log('✅ Felo Search 成功！');
    console.log('回答摘要:', result.answer.substring(0, 100) + '...');
    console.log('引用來源數量:', result.resources.length);
  } else {
    console.error('❌ Felo Search 失敗。');
  }
}

// 由於 Node 環境缺乏 import.meta.env，此測試僅作為邏輯參考
// 在 Vite 中執行時會正常運作
console.log('測試邏輯已就緒。');
