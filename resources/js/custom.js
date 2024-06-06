

    // Gắn sự kiện kết thúc video
    document.getElementsByTagName("video")[0].addEventListener('ended', hideVideoDiv);

    // Gắn sự kiện click cho nút chính
    document.getElementById('main-btn').addEventListener('click', function() {
        window.location.href = 'scene1.html'; // Redirect to scene1.html
    });
    
    // Hàm ẩn video và hiển thị nội dung
    function hideVideoDiv() {
        document.getElementById("intro-video").style.display = "none";
        document.getElementById("main").style.display = "block"; // Hiển thị phần #main
    }

    
   

