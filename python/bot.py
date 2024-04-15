#pip install telethon
#pip install playsound
#pip install --upgrade wheel
#pip install pandas

from telethon.sync import TelegramClient
import sqlite3
import datetime
import re
import pytz
from playsound import playsound
import time

connection = sqlite3.connect("milhas.db", isolation_level=None)
cursor = connection.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS milhas (chatId TEXT, chat TEXT, codigo TEXT, data TEXT, valor REAL, milhas REAL, pessoas INTEGER, internacional INTEGER)")


api_id = 6666349
api_hash = '4c074f23d3c9basdfadf347'

chats = [-1999999999, -188888888]

chatName = {'-1999999999':'NOME DO GRUPO', '-188888888': 'NOME DO GRUPO'}

min_value_latam = 26
min_value_azul = 21.5

#date_start = datetime.datetime(2024, 1, 16, 2, 00, 00, tzinfo = pytz.utc)
date_start = datetime.datetime.now(datetime.UTC)


while True:
    for chat in chats:
        with TelegramClient('PIX', api_id, api_hash) as client:
            client.start()
            for message in client.iter_messages(chat, offset_date=date_start , reverse=True):
                
                value = re.search(r'Paga:(.*?)por', message.message).group(1).strip().replace('R$', '')

                milhas = re.search(r' por (.*?)milhas', message.message).group(1).strip()

                code  = re.search(r'Envie o código(.*?)para', message.message).group(1).strip()

                chatbot  = re.search(r'para(.*?)para vender pra ele.', message.message).group(1).strip()

                quantity = re.search(r'Interessado em COMPRAR(.*?)milhas', message.message).group(1).strip().replace('.', '')

                cpf  = re.search(r',(.*?), Paga:', message.message).group(1).strip().replace('CPF', '').strip()

                internacional = re.search(r'milhas(.*?),', message.message).group(1).strip().lower().replace('#latam', '').strip()
                is_us = 1 if internacional=="us" else 0
                
                date_local = message.date.astimezone(pytz.timezone('America/Sao_Paulo')).strftime('%Y-%m-%d %H:%M:%S')
                date_utc = message.date.strftime('%Y-%m-%d %H:%M:%S')

                if (is_us == 0):
                    if ((chat == -1001635819014) and ( float(value) >= min_value_latam) ) or ((chat == -1001636161157) and ( float(value) >= min_value_azul) ):
                        print(chatName[str(chat)])
                        print("CPF: ", cpf)
                        print("Valor: ", value)
                        print("Milhas: ", quantity)
                        print("Código: ", code)
                        print("US: ", "SIM" if internacional=="us" else "NÃO")

                        print(date_local)                        
                        
                        cursor.execute("INSERT INTO milhas (chatId, chat, codigo, data, valor, milhas, pessoas, internacional) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (chat, chatName[str(chat)], code, date_local, float(value), quantity, cpf, is_us ))
                                            
                        print('-------------------------------------------')
                        user_id='USER_ID'
                        user_bot='@USER_BOT'
                        entity=client.get_entity(user_bot)
                        #playsound('Mario-coin-sound.mp3')
                        client.send_message(entity=entity,message=code)
                    date_start = message.date + datetime.timedelta(0,1)
    time.sleep(3)
