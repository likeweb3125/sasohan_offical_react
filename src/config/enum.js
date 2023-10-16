const api_uri = "https://api.sasohan.net";

exports.enum_api_uri = {
    api_uri: `${api_uri}`,

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
    //포인트충전
    m_info:`${api_uri}/v1/app/mypage/profile`,
    m_point:`${api_uri}/v1/app/mypage/point`,
    m_pay_check:`${api_uri}/v1/pay/notice/:var1`,
    m_pay_logs:`${api_uri}/v1/pay/logs`,
    //프로필수정
    m_profile_info:`${api_uri}/v1/app/mypage/profile-info`,
    m_change_password:`${api_uri}/v1/app/mypage/change-password`,
}