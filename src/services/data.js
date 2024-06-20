import {ref} from 'vue'

const getData = ()=> {
    const post = ref(null)
    const load = async () => {
        try {
            let response = await fetch("https://192.168.44.95:8443/api/v2.1/tables", {
                headers: {
                    'Authorization': `Bearer eb736f3feb05e99f4f6d8a61443464bb26c289736d7ec639d95642c8da92b307`
                }
            });

            let data = await response.json();
            console.log("tables = ",data.tables)
            post.value = data.tables;

        } catch (e) {
            console.error(e);
        }
    }
    return {post,load};
}

export default getData;