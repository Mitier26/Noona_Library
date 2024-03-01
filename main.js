

    const API_KEY = `0d60452df08b29527128ee96f993660c1f3722369b9e8f087b6b69f215762f38
    `;
    
    let bookList = [];




    const getBookhj = async() =>{
        const url = new URL(`http://data4library.kr/api/srchBooks?authKey=${API_KEY}&keyword=${url.searchParams.set("isbn13", 9791161571379)}`);
    
        url.searchParams.set('format', 'json');
    const response = await fetch(url);
    const data = await response.json();
    bookList = data.response.docs;
    
    console.log(data.response.docs,"data")
    modalRender()
    }


    function modalRender() {
        let booksHTML = bookList
            .map(
                (book) =>
            `<div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">${bookList.bookname}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                    <img src="${bookList.bookImageURL}"/>
            </div>
                
            <div class="modal-footer">
                <ur class="modal-items">
                    <li class="list-group-item">- 랭킹 :${bookList.ranking}</li>
                    <li class="list-group-item">- 저자명 :${bookList.authors}</li>
                    <li class="list-group-item">- 주제분류 :${bookList.class_nm}</li>
                    <li class="list-group-item">- 출판사 :${bookList.publisher}</li>
                    <li class="list-group-item">- 책소개 :${bookList.description}</li>
                    <li class="list-group-item">- 발행년도 :${bookList.publication_year}</li>
                    <li class="list-group-item">- ISBN :${bookList.isbn13}</li>
                </ur>
            </div>
            `
            )
            .join('');

        document.getElementById('modal-content').innerHTML = booksHTML;
    }

    getBookhj();

