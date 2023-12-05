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

    //랭킹---
    rank_list: `${api_uri}/v1/main/ranking`,
    rank_sms: `${api_uri}/v1/main/ranking-sms`,
    rank_done: `${api_uri}/v1/main/ranking-confirm`,


    //앱----------------------------------------
    //회원가입
    m_realname_okurl: `https://jja-gg.com/member/okurl_app.asp`,
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