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
}