// 문서가 전부 로딩되면 작동하라는 뜻
// window.onload = function () {
// 스크립트 작성 하는 곳
/*
        작성자 : 우명균
    */
// API 키를 배열로 만들어 키가 막혔을 때 다른 키를 사용한다.
// ttbmitier1409002
const API_KEY = [`09f34dfde082ce1b964aeba567e3ecaab58fff794ea4607015ef0709449211a1`];

let url1 = new URL('https://www.nl.go.kr/NL/search/openApi/search.do?');
let url = new URL('http://data4library.kr/api/loanItemSrch?');
let bookList = [];

// 화면에 표시되는 줄수
const lineCount = 3;

// 현재 패이지, 출력 item 수
let pageNum = 1;
let pageSize = itemCountCalculator();

// 검색용
let systemType = '';
// category는 메인페이지에서 값을 받아서 사용하고 사이드 버튼에서도 사용
let category = '';

async function getBook() {
    try {
        url.searchParams.set('authKey', API_KEY[0]);
        url.searchParams.set('startDt', '2022-01-01');
        url.searchParams.set('endDt', '2022-03-31');

        // url.searchParams.set('gender', 1);
        // url.searchParams.set('age', 20);

        // url.searchParams.set('region', 11);
        // url.searchParams.set('addCode', 0);
        // url.searchParams.set('kdc', 6);
        url.searchParams.set('dtl_kdc', 43);
        url.searchParams.set('pageNo', 1);
        url.searchParams.set('pageSize', 1);
        url.searchParams.set('format', 'json');

        console.log(url);
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        bookList = data.response.docs;
        console.table(bookList);

        moreRender();
    } catch (error) {
        console.log(error);
    }
}

function moreRender() {
    let booksHTML = bookList
        .map(
            (book) =>
                `<div class="card">
                    <img src="${book.doc.bookImageURL}" alt="" />
                    <ul>
                        <li>제목<span>${
                            book.doc.bookname.split(':')[0].length >= 0
                                ? book.doc.bookname.split(':')[0].slice(0, 8) + '...'
                                : book.doc.bookname.split(':')[0]
                        }</span></li>
                        <li>작가<span>${
                            book.doc.authors.includes(':')
                                ? book.doc.authors.split(':')[1].trim()
                                : book.doc.authors.includes(';')
                                ? `${book.doc.authors.split(';')[0].trim()}<br>${book.doc.authors.split(';')[1].trim()}`
                                : book.doc.authors.trim()
                        }</span></li>
                        <li>분류<span>${book.doc.class_nm.split('>').pop()}</span></li>
                        <li>발행자<span>${book.doc.publisher}</span></li>
                        <li>발행일<span>${book.doc.publication_year}</span></li>
                    </ul>
                </div>`
        )
        .join('');

    document.getElementById('mg-card-holder').innerHTML = booksHTML;
}

getBook();

function itemCountCalculator() {
    if (window.innerWidth < 451) return 10;
    else if (window.innerWidth < 768) return 10;
    else if (window.innerWidth < 992) return 3 * lineCount;
    else if (window.innerWidth < 1200) return 4 * lineCount;
    else if (window.innerWidth < 1400) return 5 * lineCount;
    else if (window.innerWidth >= 1400) return 6 * lineCount;
}

window.addEventListener('resize', itemCountCalculator);
// };
