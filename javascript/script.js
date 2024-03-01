/*
        작성자 : 우명균
    */
// API 키를 배열로 만들어 키가 막혔을 때 다른 키를 사용한다.
// ttbmitier1409002
const API_KEY = [`09f34dfde082ce1b964aeba567e3ecaab58fff794ea4607015ef0709449211a1`];

let url = new URL('http://data4library.kr/api/srchBooks?');
let titleSearchList = [];
let authorSearchList = [];
let keywordSearchList = [];

// 화면에 표시되는 줄수
const lineCount = 3;

// 현재 패이지, 출력 item 수
let pageNum = 1;
let pageSize = itemCountCalculator();

let response;
let date;

async function searchBook(keyword) {
    try {
        url.searchParams.set('authKey', API_KEY[0]);
        url.searchParams.set('pageNo', 1);
        url.searchParams.set('pageSize', 1);
        url.searchParams.set('format', 'json');

        // title 검색
        url.searchParams.set('title', keyword);
        response = await fetch(url);
        if (!response.ok) {
            throw new Error(`책 검색 중 오류 발생: ${response.statusText}`);
        }
        data = await response.json();
        titleSearchList = data.response.docs;
        url.searchParams.delete('title');

        // author 검색
        url.searchParams.set('author', keyword);
        response = await fetch(url);
        if (!response.ok) {
            throw new Error(`책 검색 중 오류 발생: ${response.statusText}`);
        }
        data = await response.json();
        authorSearchList = data.response.docs;
        url.searchParams.delete('author');

        // keyword 검색
        url.searchParams.set('keyword', keyword);
        response = await fetch(url);
        if (!response.ok) {
            throw new Error(`책 검색 중 오류 발생: ${response.statusText}`);
        }
        data = await response.json();
        keywordSearchList = data.response.docs;
        url.searchParams.delete('keyword');

        

        // if (titleSearchList.length === 0 && authorSearchList.length === 0 && keywordSearchList.length === 0) {
        //     throw new Error('검색어에 해당하는 책이 없습니다.');
        // }

        searchRender();

    } catch (error) {
        console.error(error);
    }
}

function searchRender() {
    let searchTitleBooksHTML = titleSearchList
        .map(
            (book) =>

                `<div class="card" onclick='modalRender('${book.doc.isbn13}')'>
                    <img src="${book.doc.bookImageURL}" alt="" />
                    <ul>
                        <li>제목<span>${
                            book.doc.bookname.split(':')[0].length >= 0
                                ? book.doc.bookname.split(':')[0].slice(0, 8) + '...'
                                : book.doc.bookname.split(':')[0]
                        }</span></li>
                        <li>작가<span>
                        ${
                            book.doc.authors.includes(';')
                                ? (book.doc.authors.split(';')[0].includes(':')
                                    ? book.doc.authors.split(';')[0].split(':')[1]
                                    : book.doc.authors.split(';')[0]) +
                                    '<br>' +
                                    (book.doc.authors.split(';')[1])
                                : book.doc.authors.includes(':')
                                ? book.doc.authors.split(':')[1]
                                : book.doc.authors
                        }
                        
                        </span></li>
                    </ul>
                </div>`
        )
        .join('');

        let searchAuthorBooksHTML = authorSearchList
        .map(
            (book) =>

                `<div class="card" onclick='modalRender('${book.doc.isbn13}')'>
                    <img src="${book.doc.bookImageURL}" alt="" />
                    <ul>
                        <li>제목<span>${
                            book.doc.bookname.split(':')[0].length >= 0
                                ? book.doc.bookname.split(':')[0].slice(0, 8) + '...'
                                : book.doc.bookname.split(':')[0]
                        }</span></li>
                        <li>작가<span>
                        ${
                            book.doc.authors.includes(';')
                                ? (book.doc.authors.split(';')[0].includes(':')
                                    ? book.doc.authors.split(';')[0].split(':')[1]
                                    : book.doc.authors.split(';')[0]) +
                                    '<br>' +
                                    (book.doc.authors.split(';')[1])
                                : book.doc.authors.includes(':')
                                ? book.doc.authors.split(':')[1]
                                : book.doc.authors
                        }
                        
                        </span></li>
                    </ul>
                </div>`
        )
        .join('');

        let searchKeywordBooksHTML = keywordSearchList
        .map(
            (book) =>

                `<div class="card" onclick='modalRender('${book.doc.isbn13}')'>
                    <img src="${book.doc.bookImageURL}" alt="" />
                    <ul>
                        <li>제목<span>${
                            book.doc.bookname.split(':')[0].length >= 0
                                ? book.doc.bookname.split(':')[0].slice(0, 8) + '...'
                                : book.doc.bookname.split(':')[0]
                        }</span></li>
                        <li>작가<span>
                        ${
                            book.doc.authors.includes(';')
                                ? (book.doc.authors.split(';')[0].includes(':')
                                    ? book.doc.authors.split(';')[0].split(':')[1]
                                    : book.doc.authors.split(';')[0]) +
                                    '<br>' +
                                    (book.doc.authors.split(';')[1])
                                : book.doc.authors.includes(':')
                                ? book.doc.authors.split(':')[1]
                                : book.doc.authors
                        }
                        
                        </span></li>
                    </ul>
                </div>`
        )
        .join('');

    document.getElementById('title-holder').innerHTML = searchTitleBooksHTML;
    document.getElementById('author-holder').innerHTML = searchAuthorBooksHTML;
    document.getElementById('keyword-holder').innerHTML = searchKeywordBooksHTML;
}
{/* <li>분류<span>${book.doc.class_nm.split('>').pop()}</span></li>
<li>발행자<span>${book.doc.publisher}</span></li>
<li>발행일<span>${book.doc.publication_year}</span></li> */}

function itemCountCalculator() {
    if (window.innerWidth < 451) return 10;
    else if (window.innerWidth < 768) return 10;
    else if (window.innerWidth < 992) return 3 * lineCount;
    else if (window.innerWidth < 1200) return 4 * lineCount;
    else if (window.innerWidth < 1400) return 5 * lineCount;
    else if (window.innerWidth >= 1400) return 6 * lineCount;
}

window.addEventListener('resize', itemCountCalculator);


// 검색창 부분
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const searchType = document.querySelectorAll('.search-type');

// 검색 타입 버튼
searchType.forEach(btn => {
    btn.addEventListener('click', function(){
        console.log(btn.id);
    });
});

// 검색 하기 버튼
searchBtn.addEventListener('click', function () {
    const inputValue = searchInput.value.trim();

    if (!inputValue) {
        const returnVal = prompt("검색어를 입력해 주세요");

        if (returnVal) {
            searchInput.value = returnVal;
            console.log(returnVal);
            searchBook(returnVal);
        }
    } else {
        console.log(inputValue);
        searchBook(inputValue);
    }
});
