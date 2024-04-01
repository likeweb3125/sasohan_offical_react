const api_uri = "https://api.sasohan.net";

exports.enum_api_uri = {
    api_uri: `${api_uri}`,

    //메인---
    m_list: `${api_uri}/v1/main/manager`,
    blog_list: `${api_uri}/v1/main/blog`,
    ytb_list: `${api_uri}/v1/main/youtube`,
    review_list: `${api_uri}/v1/main/review-list`,
    review_cont: `${api_uri}/v1/main/review-content/:list_no`,
    user_count: `${api_uri}/v1/main/user-count`,
    policy_cont: `${api_uri}/v1/site/policy/:policy_type`,
    site_info: `${api_uri}/v1/site/site-info`,
    date_apply: `${api_uri}/v1/main/requset`,
    story_list: `${api_uri}/v1/main/story-list`,
    story_view: `${api_uri}/v1/main/story-view/:list_no`,
    license_list: `${api_uri}/v1/main/app-license/:idx`,

    //회원---
    m_realname_okurl: `https://jja-gg.com/member/okurl_web.asp`,
    login: `${api_uri}/v1/app/user/user-login`,
    login_code: `${api_uri}/v1/app/user/user-login-code`,
    login_phone: `${api_uri}/v1/app/user/user-login-phone`,
    feed_profile_add: `${api_uri}/v1/app/user/feed-profile-add`,
    feed_profile_delt: `${api_uri}/v1/app/user/feed-profile-remove/:filename`,
    find_id_sms: `${api_uri}/v1/app/user/find-id-sms`,
    find_id: `${api_uri}/v1/app/user/find-id`,
    find_pw_sms: `${api_uri}/v1/app/user/find-pw-sms`,
    find_pw: `${api_uri}/v1/app/user/find-pw-site`,
    reset_pw: `${api_uri}/v1/reset/password`,
    basic_profile: `${api_uri}/v1/main-mypage/basic-profile`,
    all_profile: `${api_uri}/v1/main-mypage/all-profile`,
    basic_profile_modify: `${api_uri}/v1/main-mypage/profile-modify`,
    profile_modify: `${api_uri}/v1/main-mypage/type-modify`,
    profile2_modify: `${api_uri}/v1/main-mypage/ideal-modify`,
    user_delt_code: `${api_uri}/v1/main-mypage/leave-sign`,
    user_delt: `${api_uri}/v1/main-mypage/leave`,

    //스퀘어---
    feed_list: `${api_uri}/v1/main/feed-list`,
    feed_favorite: `${api_uri}/v1/manager-feed/feed-favorite`,
    feed_content: `${api_uri}/v1/main/feed-content/:idx`,
    feed_delt: `${api_uri}/v1/manager/feed-delete/:idx`,
    feed_comment_list: `${api_uri}/v1/main/feed-comment/:idx`,
    feed_comment: `${api_uri}/v1/manager-feed/feed-comment-regist`,
    feed_comment_modify: `${api_uri}/v1/manager-feed/feed-comment-modify`,
    feed_comment_delt: `${api_uri}/v1/manager-feed/feed-comment-delete/:idx`,
    text_check: `${api_uri}/v1/common/sentiment`,
    //매니저
    manager_list: `${api_uri}/v1/main/manager-list`,
    manager_favorite: `${api_uri}/v1/manager-feed/manager-favorite`,
    manager_profile: `${api_uri}/v1/main/manager-profile/:m_id`,
    guest_book_list: `${api_uri}/v1/main/guest-book/:m_id`,
    guest_book: `${api_uri}/v1/manager-feed/guest-book-regist`,
    guest_book_delt: `${api_uri}/v1/manager-feed/guest-book-delete/:idx`,
    manager_feed_list: `${api_uri}/v1/main/feed-list/:m_id`,
    feed_img: `${api_uri}/v1/manager/manager-image-add`,
    feed_img_delt: `${api_uri}/v1/manager/feed-image-remove`,
    feed_add: `${api_uri}/v1/manager/feed-add`,
    feed_modify: `${api_uri}/v1/manager/feed-modify`,
    
    //VIP 소개팅
    vip_list: `${api_uri}/v1/main/vip-list`,
    vip_apply: `${api_uri}/v1/main/vip-request`,
    vip_apply_img: `${api_uri}/v1/main/vip-request/image-add`,
    vip_apply_img_delt: `${api_uri}/v1/main/vip-request/image-remove/:filename`,
    



    //랭킹---
    rank_list: `${api_uri}/v1/main/ranking`,
    rank_sms: `${api_uri}/v1/main/ranking-sms`,
    rank_done: `${api_uri}/v1/main/ranking-confirm`,
    rank_token: `${api_uri}/v1/main/ranking-token`,
    rank_profile_img: `${api_uri}/v1/main/ranking-profile/image-add`,
    rank_profile_img_delt: `${api_uri}/v1/main/ranking-profile/image-remove/:filename`,
    rank_profile: `${api_uri}/v1/main-mypage/ranking-profile/modify`,


    //앱----------------------------------------
    //회원가입
    m_realname_app_okurl: `https://jja-gg.com/member/okurl_app.asp`,
    m_realname: `${api_uri}/v1/app/user/realname/:tradeid`,
    m_id_check: `${api_uri}/v1/app/user/check-id/:m_id`,
    m_nick_check: `${api_uri}/v1/app/user/check-nic`,
    m_address: `${api_uri}/v1/select-list/address`,
    m_address2: `${api_uri}/v1/select-list/address/:parent_local_code`,
    m_select_list: `${api_uri}/v1/select-list`,
    m_img_add: `${api_uri}/v1/app/user/user-profile-add`,
    m_join: `${api_uri}/v1/app/user/join`,
    //마이페이지 - 포인트충전
    m_info:`${api_uri}/v1/app/mypage/profile`,
    m_point:`${api_uri}/v1/app/mypage/point`,
    m_pay_check:`${api_uri}/v1/pay/notice/:var1`,
    m_pay_logs:`${api_uri}/v1/pay/logs`,
    //마이페이지 - 프로필수정
    m_profile_info:`${api_uri}/v1/app/mypage/profile-info`,
    m_profile_modify:`${api_uri}/v1/app/mypage/profile-modify`,
    m_change_password:`${api_uri}/v1/app/mypage/change-password`,
    //마이페이지 - 회원탈퇴
    m_leave_info:`${api_uri}/v1/app/mypage/leave-info`,
    m_leave:`${api_uri}/v1/app/mypage/leave`,
    //공지사항 - 상세
    m_list_detail:`${api_uri}/v1/app/bbs/:list_no`,

}