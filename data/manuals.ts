import type { Manual } from "@/types/manual";

export const manuals: Manual[] = [
  {
    id: "xiaomi-air-purifier-4-lite",
    productName: "Xiaomi Smart Air Purifier 4 Lite",
    brand: "Xiaomi",
    modelName: "AC-M17-SC",
    category: "생활가전",
    manualUrl: "https://www.mi.com/global/support/user-guide/",
    fileUrl: null,
    filePath: null,
    fileType: null,
    fileName: null,
    summaryKo: "공기질 센서와 자동 모드를 활용해 실내 미세먼지 상태에 맞춰 풍량을 조절하는 스마트 공기청정기입니다.",
    quickGuide: [
      "전원 케이블을 연결하고 상단 전원 버튼을 누릅니다.",
      "모드 버튼으로 자동, 수면, 수동 모드를 전환합니다.",
      "Mi Home 앱에서 기기를 추가하면 예약과 원격 제어를 사용할 수 있습니다."
    ],
    troubleshooting: [
      {
        title: "앱에서 기기가 검색되지 않음",
        solution: "공기청정기와 휴대폰이 같은 2.4GHz Wi-Fi에 연결되어 있는지 확인한 뒤 Wi-Fi 재설정을 진행하세요."
      },
      {
        title: "필터 교체 알림이 계속 표시됨",
        solution: "정품 필터 장착 후 전원 버튼과 모드 버튼을 동시에 길게 눌러 필터 수명을 초기화하세요."
      }
    ],
    translationStatus: "complete",
    createdAt: "2026-05-18",
    status: "approved",
    contributor: "wiki-blue",
    contributorId: null,
    contributorEmail: null,
    contributorNickname: "wiki-blue"
  },
  {
    id: "sony-wh-1000xm5",
    productName: "Sony WH-1000XM5",
    brand: "Sony",
    modelName: "WH-1000XM5",
    category: "오디오",
    manualUrl: "https://helpguide.sony.net/mdr/wh1000xm5/v1/en/",
    fileUrl: null,
    filePath: null,
    fileType: null,
    fileName: null,
    summaryKo: "노이즈 캔슬링, 주변 소리 제어, 멀티포인트 연결을 지원하는 무선 헤드폰입니다.",
    quickGuide: [
      "전원 버튼을 2초 이상 눌러 헤드폰을 켭니다.",
      "처음 연결 시 블루투스 설정에서 WH-1000XM5를 선택합니다.",
      "오른쪽 터치 패널을 쓸어 넘겨 볼륨과 재생을 조절합니다."
    ],
    troubleshooting: [
      {
        title: "블루투스 연결이 자주 끊김",
        solution: "Sony Headphones Connect 앱에서 펌웨어를 확인하고 주변 2.4GHz 간섭이 적은 위치에서 다시 페어링하세요."
      },
      {
        title: "노이즈 캔슬링 효과가 약함",
        solution: "이어패드 착용 위치를 조정하고 앱에서 노이즈 캔슬링 최적화를 실행하세요."
      }
    ],
    translationStatus: "complete",
    createdAt: "2026-05-22",
    status: "approved",
    contributor: "sound-doc",
    contributorId: null,
    contributorEmail: null,
    contributorNickname: "sound-doc"
  },
  {
    id: "canon-powershot-g7x-mark-ii",
    productName: "Canon PowerShot G7X Mark II",
    brand: "Canon",
    modelName: "G7X Mark II",
    category: "카메라",
    manualUrl: "https://www.usa.canon.com/support",
    fileUrl: null,
    filePath: null,
    fileType: null,
    fileName: null,
    summaryKo: "1인치 센서와 틸트 LCD를 갖춘 컴팩트 카메라로 브이로그와 여행 촬영에 적합합니다.",
    quickGuide: [
      "배터리와 SD 카드를 삽입한 뒤 전원 버튼을 누릅니다.",
      "상단 모드 다이얼에서 Auto 또는 Movie를 선택합니다.",
      "Wi-Fi 메뉴에서 스마트폰 연결을 설정해 이미지를 전송합니다."
    ],
    troubleshooting: [
      {
        title: "메모리 카드 오류",
        solution: "카드 잠금 스위치를 확인하고 카메라 메뉴에서 SD 카드를 포맷하세요."
      },
      {
        title: "초점이 맞지 않음",
        solution: "접사 거리보다 가까운 피사체는 뒤로 물러나고 AF 프레임이 피사체에 위치하도록 반셔터를 누르세요."
      }
    ],
    translationStatus: "review",
    createdAt: "2026-05-27",
    status: "approved",
    contributor: "camera-keeper",
    contributorId: null,
    contributorEmail: null,
    contributorNickname: "camera-keeper"
  },
  {
    id: "bosch-gsb-18v-drill",
    productName: "Bosch GSB 18V Drill",
    brand: "Bosch",
    modelName: "GSB 18V-55",
    category: "공구",
    manualUrl: "https://www.bosch-professional.com/manuals/",
    fileUrl: null,
    filePath: null,
    fileType: null,
    fileName: null,
    summaryKo: "목재, 금속, 콘크리트 천공을 지원하는 18V 충전 임팩트 드릴 드라이버입니다.",
    quickGuide: [
      "충전된 배터리를 본체 하단에 끝까지 밀어 넣습니다.",
      "작업 재질에 맞춰 토크 링과 드릴 모드를 선택합니다.",
      "비트를 척에 단단히 고정한 뒤 낮은 속도에서 작업을 시작합니다."
    ],
    troubleshooting: [
      {
        title: "드릴이 작동하지 않음",
        solution: "배터리 충전 상태와 삽입 방향을 확인하고 과열된 경우 충분히 식힌 뒤 다시 사용하세요."
      },
      {
        title: "비트가 흔들림",
        solution: "척을 완전히 풀었다가 비트를 중앙에 넣고 세 지점이 균일하게 물리도록 조이세요."
      }
    ],
    translationStatus: "draft",
    createdAt: "2026-06-01",
    status: "approved",
    contributor: "tool-note",
    contributorId: null,
    contributorEmail: null,
    contributorNickname: "tool-note"
  },
  {
    id: "nintendo-switch",
    productName: "Nintendo Switch",
    brand: "Nintendo",
    modelName: "HAC-001",
    category: "게임기",
    manualUrl: "https://en-americas-support.nintendo.com/app/products/detail/p/989",
    fileUrl: null,
    filePath: null,
    fileType: null,
    fileName: null,
    summaryKo: "TV 모드, 테이블 모드, 휴대 모드를 전환하며 사용할 수 있는 하이브리드 게임 콘솔입니다.",
    quickGuide: [
      "Joy-Con을 본체 양쪽에 장착하고 전원 버튼을 누릅니다.",
      "초기 설정에서 언어, 지역, Wi-Fi, 닌텐도 계정을 설정합니다.",
      "TV 사용 시 독에 본체를 넣고 HDMI 입력을 선택합니다."
    ],
    troubleshooting: [
      {
        title: "Joy-Con 입력 지연",
        solution: "컨트롤러 업데이트를 실행하고 본체와 컨트롤러 사이 장애물을 줄이세요."
      },
      {
        title: "TV 화면이 나오지 않음",
        solution: "정품 AC 어댑터와 HDMI 케이블 연결 순서를 확인하고 독의 LED 상태를 확인하세요."
      }
    ],
    translationStatus: "complete",
    createdAt: "2026-06-05",
    status: "approved",
    contributor: "play-manual",
    contributorId: null,
    contributorEmail: null,
    contributorNickname: "play-manual"
  },
  {
    id: "dji-osmo-pocket-3",
    productName: "DJI Osmo Pocket 3",
    brand: "DJI",
    modelName: "Osmo Pocket 3",
    category: "카메라",
    manualUrl: "https://www.dji.com/support/product/osmo-pocket-3",
    fileUrl: null,
    filePath: null,
    fileType: null,
    fileName: null,
    summaryKo: "3축 짐벌과 회전형 터치스크린을 갖춘 휴대용 브이로그 카메라입니다.",
    quickGuide: [
      "화면을 회전해 전원을 켜고 언어와 활성화를 완료합니다.",
      "녹화 버튼을 눌러 촬영을 시작하고 조이스틱으로 짐벌 방향을 조절합니다.",
      "DJI Mimo 앱에 연결해 펌웨어 업데이트와 파일 전송을 진행합니다."
    ],
    troubleshooting: [
      {
        title: "짐벌 보호 모드 표시",
        solution: "전원을 끄고 짐벌 주변 이물질을 제거한 뒤 평평한 곳에서 다시 켜세요."
      },
      {
        title: "앱 연결 실패",
        solution: "블루투스와 Wi-Fi 권한을 허용하고 DJI Mimo 앱을 최신 버전으로 업데이트하세요."
      }
    ],
    translationStatus: "review",
    createdAt: "2026-06-10",
    status: "approved",
    contributor: "creator-doc",
    contributorId: null,
    contributorEmail: null,
    contributorNickname: "creator-doc"
  }
];
