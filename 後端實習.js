const axios = require('axios');

// 下載交易歷史數據
const url = 'https://gist.githubusercontent.com/twzjwang/9eb6711b5716f24b0c7d4e57512ac8b2/raw/14fff9e03c38cb2142e0d4db0ca6634c753aa39e/trades.json';

axios.get(url)
  .then(response => {
    const tradingHistory = response.data.data;//得到共80筆資料
    //console.log(tradingHistory)
    if (!Array.isArray(tradingHistory)) {
      console.error('交易歷史數據無效');
      return;
    }

    // 初始化變量來跟蹤性能指標
    let initialCapital = 8000;  // 初始本金（以USDT計）
    let finalCapital = initialCapital;
    let totalTrades = 0;
    let winningTrades = 0;
    let totalPnl = 0;

    // 計算性能指標
    tradingHistory.forEach(trade => {
      let pnl = parseFloat(trade.fillPnl);
      let fee = parseFloat(trade.fee);
      if (pnl !== 0) {
        totalTrades++;
        finalCapital += pnl + fee;
        //console.log(`pnl: ${pnl.toFixed(3)}%`);
        //console.log(`finalCapital: ${finalCapital.toFixed(3)}%`);
        if (pnl > 0) {
          winningTrades++;
        }
        totalPnl += pnl;
      }
    });

    let ROI = ((finalCapital - initialCapital) / initialCapital) * 100;
    let winRate2 = (winningTrades / totalTrades) * 100;
    // 輸出結果
    console.log(`ROI: ${ROI.toFixed(3)}%`);
    //console.log(`勝率: ${winRate1.toFixed(3)}%`);
    console.log(`勝率(Win Rate): ${winRate2.toFixed(3)}%`);

    let maxDrawdown = 0;
    let peak = -Infinity;

    finalCapital = initialCapital;
    tradingHistory.forEach(trade => {
    let pnl = parseFloat(trade.fillPnl);
    let fee = parseFloat(trade.fee);
    if (pnl !== 0) {
        finalCapital += pnl + fee;
        peak = Math.max(peak, finalCapital);
        let drawdown = (peak - finalCapital) / peak *100;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
    });
    console.log(`最大回撤（MDD）: ${maxDrawdown.toFixed(10)}%`);


    winningTrades = 0;
    let losingTrades = 0;
    // 計算性能指標
    tradingHistory.forEach(trade => {
      let pnl = parseFloat(trade.fillPnl);
      if (pnl !== 0) {
        if (pnl > 0) {
          winningTrades++;
        } else {
          losingTrades++;
        }
      }
    });
    let oddsRatio = winningTrades / losingTrades*100;
    console.log(`勝敗比(Odds Ratio): ${oddsRatio.toFixed(2)}%`);



    let profitFactor = Math.abs(totalPnl) / Math.abs(totalPnl - initialCapital)*100;

    console.log(`獲利因子（Profit Factor）: ${profitFactor.toFixed(10)}%`);


    // 計算fillPnl的標準差
    
    // 計算fillPnl的平均值
    const sumFillPnl = tradingHistory.reduce((acc, trade) => acc + parseFloat(trade.fillPnl), 0);
    const avgFillPnl = sumFillPnl / tradingHistory.length;

    const fillPnlData = tradingHistory.map(trade => parseFloat(trade.fillPnl));
    const sumOfSquares = fillPnlData.reduce((acc, val) => acc + Math.pow(val - avgFillPnl, 2), 0);
    const stdDev = Math.sqrt(sumOfSquares / fillPnlData.length);
    // 輸出結果
    sharpeRatio = (ROI-0.01)/stdDev;
    console.log(`fillPnl的標準差：${stdDev.toFixed(10)}`);
    console.log(`夏普比率（Sharpe Ratio）:${sharpeRatio.toFixed(10)}`);




  })
