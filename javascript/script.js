/*
        작성자 : 우명균
    */
// API 키를 배열로 만들어 키가 막혔을 때 다른 키를 사용한다.
// ttbmitier1409002
const API_KEY = [`09f34dfde082ce1b964aeba567e3ecaab58fff794ea4607015ef0709449211a1`];

let url = new URL('http://data4library.kr/api/srchBooks?');
let bookList = [];

// 화면에 표시되는 줄수
const lineCount = 3;

// 현재 패이지, 출력 item 수
let pageNum = 1;
let pageSize = itemCountCalculator();

let keyword = '';

async function searchBook() {
    try {

        keyword = '환경';
        url.searchParams.set('authKey', API_KEY[0]);

        url.searchParams.set('keyword', keyword);
        url.searchParams.set('dtl_kdc', 43);
        url.searchParams.set('pageNo', 1);
        url.searchParams.set('pageSize', 1);
        url.searchParams.set('format', 'json');

        console.log(url);
        const response = await fetch(url);
        console.log(response);
        const data = await response.json();
        console.log(data);
        bookList = data.response.docs;
        console.table(bookList);

        if(response.status == 200)
        {
            searchRender();
        }


    } catch (error) {
        console.log(error);
    }
}

function searchRender() {
    let booksHTML = bookList
        .map(
            (book) =>
                `<div class="card" onclick='modalRender(${book.doc.isbn13})'>
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

searchBook();

// 한 페이지에 표시할 책의 수
function itemCountCalculator() {
    let result = 0;
    if (window.innerWidth < 451) result = 10;
    else if (window.innerWidth < 768) result = 10;
    else if (window.innerWidth < 992) result = 3 * lineCount;
    else if (window.innerWidth < 1200) result = 4 * lineCount;
    else if (window.innerWidth < 1400) result = 5 * lineCount;
    else if (window.innerWidth >= 1400) result = 6 * lineCount;

    console.log(result);
    return result;
}

window.addEventListener('resize', itemCountCalculator);
