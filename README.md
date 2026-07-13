# 대한민국 인구피라미드 탐색기

대한민국 시도·시군구·읍면동의 성·연령 인구구조와 장기 인구 추세를 탐색하는 정적 웹 애플리케이션입니다.

## 운영 정본

- GitHub: https://github.com/Park-Sung-Jun/pop-pyramid
- Production: https://pop-pyramid.vercel.app/
- 배포 기준: Vercel Git 배포
- 구 GitHub Pages 배포: 제거됨

`vercel-build.mjs`는 공개 런타임 설정을 생성하고, Vercel 환경변수에 KOSIS 키와 통계표 ID가 있을 때만 선택적 추세 캐시를 만듭니다. 캐시가 없으면 화면은 저장소의 `인구1925-2070.csv`를 사용합니다.

## 검증

```powershell
node.exe tests\mobile_toggle_css.cjs
```

운영 전환 후에는 데스크톱·모바일에서 지역 검색, 단계별 선택, 지도, 피라미드, 추세, 순위, 다중 선택을 Playwright로 점검합니다.
