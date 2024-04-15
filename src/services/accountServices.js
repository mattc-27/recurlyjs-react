
async function getAccount(accountId) {
    const account = accountId;
    try {

        const response = await fetch(`/api/account/${account}`)
        const data = await response.json();
        console.log(data);
        const formattedAccount = formatAccount(data)
        return { ...formattedAccount }
    } catch (error) {
        console.error(error.message)
    }
}

const formatAccount = (data) => {
    const {
        account: { code, hasActiveSubscription, id }
    } = data
    return {
        code,
        hasActiveSubscription,
        id
    }
};

const formatSearch = async (accountSearch) => {
    if (accountSearch.length > 12) {
        const accountId = 'code-' + accountSearch
        return accountId
    } else {
        const accountId = accountSearch
        return accountId
    }
}


async function fetchSubscription(subId) {
    try {
        const response = await fetch(`/api/subscription/${subId}`)
        const data = await response.json();
        const formattedSub = formatSub(data.subscription)
        return { ...formattedSub }
    } catch (error) {
        console.error(error.message)
    }
}

const formatSub = (data) => {
    const {
        plan: { code },
        unitAmount, total, currentTermEndsAt
    } = data

    return {
        code,
        unitAmount,
        total,
        currentTermEndsAt
    };
}


export { getAccount, formatSearch, fetchSubscription, formatSub}