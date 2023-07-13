const api_uri = "https://api.sasohan-ad.net:8080";

exports.enum_api_uri = {
    api_uri: `${api_uri}`,

    //메인
    // m_top_banner: `${api_uri}/v1/main/banner`,
    m_main_notice: `${api_uri}/v1/main/notice`,
    m_site_info: `${api_uri}/v1/info/site-info`,

    // 회원
    m_id_check: `${api_uri}/v1/user/check-id/:m_id`,
    m_nick_check: `${api_uri}/v1/user/check-nic`,
    m_join: `${api_uri}/v1/user`,
    m_address: `${api_uri}/v1/user/address`,
    m_address2: `${api_uri}/v1/user/address/:parent_local_code`,
    m_login: `${api_uri}/v1/user/login`,
    m_login_admin: `${api_uri}/v1/user/admin-login/:m_id`,
    m_find_id: `${api_uri}/v1/user/find-id/email`,
    m_find_id2: `${api_uri}/v1/user/find-id/phone`,
    m_find_pass: `${api_uri}/v1/user/recover-password/email`,
    m_find_pass2: `${api_uri}/v1/user/recover-password/phone`,
    m_realname_okurl: `https://jja-gg.com/member/okurl2.asp`,
    m_realname: `${api_uri}/v1/user/realname/:tradeid`,
    m_ideal_list: `${api_uri}/v1/user/item-ideal`,
    m_character_list: `${api_uri}/v1/user/item-character`,
    m_date_list: `${api_uri}/v1/user/item-date`,
    m_ref_list: `${api_uri}/v1/user/item-ref-rul`,

    //스퀘어
    m_feed: `${api_uri}/v1/feed`,
    m_feed_detail: `${api_uri}/v1/feed/feedDetail/:list_no`,

    //서비스
    m_notice: `${api_uri}/v1/board/notice`,
    m_notice_top: `${api_uri}/v1/board/notice/top`,
    m_notice_detail: `${api_uri}/v1/board/notice/:list_no`,
    m_terms: `${api_uri}/v1/info/policy/:policy_type`,

    //매니저
    m_sasohan_manager_list: `${api_uri}/v1/main/sasohan-manager`,
    m_manager_search: `${api_uri}/v1/manager/search`,
    m_manager_list: `${api_uri}/v1/manager`,
    m_profile_fv: `${api_uri}/v1/manager/profile/favorite/:m_id`,
    m_feed_fv: `${api_uri}/v1/manager/feed/favorite/:list_no`,
    m_manager_profile: `${api_uri}/v1/manager/profile/:m_id`,
    m_manager_feeds: `${api_uri}/v1/manager/feed/:m_id`,
    m_manager_request: `${api_uri}/v1/manager/request/:manager_id`,
    m_manager_vip: `${api_uri}/v1/manager/vip/:m_id`,

    // 마이페이지
    m_myprofile: `${api_uri}/v1/mypage/myprofile`,
    m_myfeeds: `${api_uri}/v1/mypage/myfeed`,
    m_feed_delt:`${api_uri}/v1/mypage/myfeed/remove-feed/:list_no`,
    m_feed_img_upload:`${api_uri}/v1/mypage/myfeed/upload-image`,
    m_feed_img_delt:`${api_uri}/v1/mypage/myfeed/remove-image/:filename`,
    m_feed_add:`${api_uri}/v1/mypage/myfeed/add-feed`,
    m_feed_edit:`${api_uri}/v1/mypage/myfeed/modify-feed`,
    m_profile_img_upload:`${api_uri}/v1/mypage/myprofile/upload-image`,
    m_profile_img_delt:`${api_uri}/v1/mypage/myprofile/remove-image/:filename`,
    m_profile_modify:`${api_uri}/v1/mypage/myprofile/profile`,
    m_sms:`${api_uri}/v1/mypage/sms`,
    m_sms_num:`${api_uri}/v1/mypage/confirm-sms`,
    m_point_use:`${api_uri}/v1/mypage/point-use`,
    m_point_pay:`${api_uri}/v1/mypage/point-payment`,
    m_point_pre:`${api_uri}/v1/mypage/point-present`,
    m_point_refund:`${api_uri}/v1/mypage/point-refund`,
    m_decision_list:`${api_uri}/v1/mypage/meeting`,
    m_decision_ok:`${api_uri}/v1/mypage/meeting-ok`,
    m_pay_check:`${api_uri}/v1/pay/notice/:var1`,
    m_leave:`${api_uri}/v1/mypage/user-leave`,

}