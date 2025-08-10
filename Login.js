// Login.js
class Database {
    constructor(supabaseUrl, supabaseKey) {
        this.client = supabase.createClient(supabaseUrl, supabaseKey);
    }

    async findUserByEmail(email) {
        const { data, error } = await this.client
            .from('customers')
            .select('*')
            .eq('email', email);
        if (error) throw error;
        return data[0] || null;
    }

    async insertUser(email, nickname) {
        const { data, error } = await this.client
            .from('customers')
            .insert([{ email, nickname, balance: 0, coupons: 0 }]);
        if (error) throw error;
        return data;
    }
}

class LoginUI {
    constructor(db) {
        this.db = db;
        this.init();
    }

    init() {
        document.getElementById('loginBtn').addEventListener('click', () => this.login());
    }

    async login() {
        const email = document.getElementById('email').value.trim();
        const nickname = document.getElementById('nickname').value.trim();

        if (!email || !nickname) {
            alert('請輸入 Email 和暱稱');
            return;
        }

        try {
            const existingUser = await this.db.findUserByEmail(email);
            if (existingUser) {
                if (existingUser.nickname === nickname) {
                    alert('登入成功');
                } else {
                    alert('暱稱錯誤');
                }
            } else {
                await this.db.insertUser(email, nickname);
                alert('註冊並登入成功');
            }
        } catch (err) {
            console.error(err);
            alert('登入失敗，請檢查控制台');
        }
    }
}

// 初始化程式
document.addEventListener('DOMContentLoaded', () => {
    const db = new Database('https://YOUR_PROJECT.supabase.co', 'YOUR_ANON_KEY');
    new LoginUI(db);
});
