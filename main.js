import { Telegraf } from 'telegraf';
import { exec } from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';

dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

async function downloadInstagramImage(url) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('article img');
        const imageUrl = await page.evaluate(() => {
            const img = document.querySelector('article img');
            return img ? img.src : null;
        });

        await browser.close();
        return imageUrl;
    } catch (error) {
        console.error('Gagal mengambil gambar:', error);
        await browser.close();
        return null;
    }
}

bot.on('text', async (ctx) => {
    const url = ctx.message.text;
    if (!url.includes('instagram.com')) {
        return ctx.reply('Harap kirim link Instagram yang valid.');
    }

    const loadingMessages = ['⏳ Sedang mengunduh...', '🔄 Mengunduh...', '📥 Memproses...'];
    let index = 0;
    const message = await ctx.reply(loadingMessages[index]);

    const interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        ctx.telegram.editMessageText(ctx.chat.id, message.message_id, null, loadingMessages[index]);
    }, 1000);

    const filename = `ig_download_${Date.now()}`;
    const outputPath = `${filename}.mp4`;

    exec(`yt-dlp -o ${outputPath} ${url}`, async (error, stdout, stderr) => {
        clearInterval(interval);
        ctx.telegram.editMessageText(ctx.chat.id, message.message_id, null, '✅ Unduhan selesai!');

        if (!error && fs.existsSync(outputPath)) {
            await ctx.replyWithVideo({ source: outputPath });
            fs.unlinkSync(outputPath);
        } else {
            console.log('Video tidak ditemukan, coba ambil gambar...');
            const imageUrl = await downloadInstagramImage(url);
            if (imageUrl) {
                await ctx.replyWithPhoto(imageUrl);
            } else {
                ctx.reply('Gagal mengunduh konten.');
            }
        }
    });
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
