import { writeFile } from 'node:fs/promises';
import auth from '../auth.json' assert { type: 'json' };
import { rankList } from './api/honor.js';
import { heroMap } from './config/hero-config.js';
import { districtsMap, systemMap } from './config/districts.config.js';
import { sleep } from './utils/index.js';

const { userId, token } = auth;

const heroRankListMap = {};

/**
 * @params {string} area - androidQ, iosQ, androidWx, iosWx
 * @parmas {string} topInfo - top100, top50, top10
 */
const check = async (heroInfo, area, topInfo) => {
  for (const province of districtsMap) {
    try {
      console.log(`获取${province.name}排名信息...`);
      const res = await rankList({
        heroId: heroInfo.id,
        areaId: systemMap[area],
        adcode: province.adcode,
        userId,
        token,
      });
      const { data, result, returnMsg } = res.data;
      if (result) {
        console.log(returnMsg);
        break;
      }
      const list = data.list;
      if (!list.length) {
        console.log(`获取${province.name}排名失败`);
        break;
      }
      heroRankListMap[province.name] = list;
    } catch (e) {
      console.log(`获取${province.name}排名失败, 接口报错`, e);
      break;
    }
    // 防止频繁请求，被封接口
    await sleep(500);
  }

  await writeFile(
    'heroRankList.json',
    JSON.stringify(heroRankListMap, null, 2)
  );

  await rankSort(heroInfo.name, area, topInfo);
};

const rankSort = async (heroName, area, topInfo) => {
  const topIndexMap = {
    top100: 99,
    top50: 49,
    top10: 9,
  };
  const topXRankList = [];
  Object.keys(heroRankListMap).forEach((province) => {
    topXRankList.push({
      province,
      rankValue: heroRankListMap[province][topIndexMap[topInfo]].rankValue,
    });
  });

  const sortPRankList = topXRankList.sort((a, b) => b.rankValue - a.rankValue);

  await writeFile('sortProvince.json', JSON.stringify(sortPRankList, null, 2));

  const lowestProvince = sortPRankList.slice(-lowestNum);
  console.log(
    `${heroName}-${area} ${topInfo}金牌最低的${lowestNum}个省, ${new Date().toLocaleString()}`
  );
  console.log(lowestProvince);
};

// 取最低的几个省
const lowestNum = 10;
check(heroMap.莱西奥, 'iosWx', 'top100');
