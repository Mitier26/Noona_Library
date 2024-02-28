// 문서가 전부 로딩되면 작동하라는 뜻
document.onload(function () {
    // 스트립크 작성 부분
});

// 문서가 전부 로딩되면 작동하라는 뜻
document.onload(function () {
    // 스트립크 작성 부분
    const API_KEY = '';
    // 기본 연결 url
    let url = new URL(`http://data4library.kr/api/loanItemSrch?authKey=${keyword}&startDt=2024-01-01&endDt=2024-02-27`);
    // 발급키
    let keyword = `%ED%86%A76920f087955f921eb6b6f79d89fc42703ef032dc51e44b6ee7e4be168f2de590%EC%A7%80`;
    // 검색 대상
    // total(전체), title(제목), author(저자), publisher(발행자),생략지 전체
    let srchTarget = 'total';
    // 현재 페이지 번호
    let pageNum = 1;
    // 쪽당 출력 건수
    let pageSize = 10;
    let category = ``;
    // 정렬
    // ititle(제목), iauthor (저자), ipublisher (발행처), ipub_year (발행년도)
    let sort = '';
    // asc(오름차순), desc(내림차순)
    let order = 'asc';

    let bookList = [];

    // 주의점 : 카테고리와 키워드는 UTF-8로 인코딩해야 합니다.
    const getBook = async () => {
        try {
            url.searchParams.set('key', API_KEY);
            url.searchParams.set('srchTarget', srchTarget);
            keyword = encodeURIComponent(keyword); // 인코딩
            url.searchParams.set('kwd', keyword);
            url.searchParams.set('pageNum', pageNum);
            url.searchParams.set('pageSize', pageSize);
            category = encodeURIComponent(category); // 인코딩
            url.searchParams.set('category', category);

            const response = await fetch(url);
            const data = await response.json();
        } catch (error) {}
    };
});
