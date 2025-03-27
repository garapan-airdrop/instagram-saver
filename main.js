import { Telegraf } from 'telegraf';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('Kirim link Instagram untuk mengunduh video/gambar.'));

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
    const outputPath = path.join(process.cwd(), filename);

    exec(`yt-dlp -o ${outputPath} ${url}`, async (error, stdout, stderr) => {
        clearInterval(interval);
        ctx.telegram.editMessageText(ctx.chat.id, message.message_id, null, '✅ Unduhan selesai!');

        if (error) {
            console.error(stderr);
            return ctx.reply('❌ Gagal mengunduh konten. Coba lagi nanti.');
        }

        if (fs.existsSync(`${outputPath}.mp4`)) {
            await ctx.replyWithVideo({ source: `${outputPath}.mp4` });
            fs.unlinkSync(`${outputPath}.mp4`);
        } else if (fs.existsSync(`${outputPath}.jpg`)) {
            await ctx.replyWithPhoto({ source: `${outputPath}.jpg` });
            fs.unlinkSync(`${outputPath}.jpg`);
        } else {
            ctx.reply('⚠️ Format file tidak dikenali.');
        }
    });
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
