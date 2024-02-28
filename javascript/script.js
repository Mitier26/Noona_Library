// 문서가 전부 로딩되면 작동하라는 뜻
window.onload = function () {
    // 스크립트 작성 하는 곳
    const API_KEY = `f451f1b377d0055a79e2ed0208d5a45c4f1ec7a8edce14b2e85f5f09d19ef2db`;
    let url = new URL('https://www.nl.go.kr/NL/search/openApi/search.do?');
    let bookList = [];

    let pageNum = 1;
    let pageSize = 2;
    let kwd = '토지';
    let category = '도서';

    async function getBook() {
        try {
            url.searchParams.set('key', API_KEY);
            url.searchParams.set('category', category);
            url.searchParams.set('kwd', kwd);
            url.searchParams.set('apiType', 'json');
            url.searchParams.set('pageSize', pageSize);
            url.searchParams.set('pageNum', pageNum);
            const response = await fetch(url);
            const data = await response.json();
            bookList = data.result;
            console.table(bookList);
            render();
        } catch (error) {
            console.log(error);
        }
    }

    function render() {
        let booksHTML = bookList
            .map(
                (book) =>
                    `<div class="card flex-grow-1 m-3">
            <img src="https://cover.nl.go.kr/${book.imageUrl}" class="card-img-top" alt="..." />
            <div class="card-body">
                <h5 class="card-title">${book.titleInfo}</h5>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">분류:${book.kdcName1s}</li>
                <li class="list-group-item">매체구분:${book.menuName}</li>
                <li class="list-group-item">자료유형:${book.typeName}</li>
                <li class="list-group-item">자료있는곳:${book.placeInfo}</li>
                <li class="list-group-item">발행자:${book.pubInfo}</li>
                <li class="list-group-item">발행년도:${book.pubYearInfo}</li>
            </ul>
            
            <div class="card-body">
                <a href="https://cover.nl.go.kr${book.detailLink}" class="card-link">상세페이지</a>
            </div>
        </div>`
            )
            .join('');

        console.log(booksHTML);
        document.getElementById('card-holder').innerHTML = booksHTML;
    }

    getBook();
};
