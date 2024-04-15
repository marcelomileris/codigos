import datetime
import logging

# Para sacar env variables:
from os import getenv

# Para ligar-me ao FTP (é um package base do python):
import ftplib

# Para usar regex no nome dos ficheiros:
import re

# Para ler os ficheiros do FTP:
import io

# pandas para ler os csv do FTP e para preparar tabela a guardar na BD em Azure:
import pandas as pd

# Para ler o xml que sai do contador da Tyco:
from xml.dom.minidom import parse

# Para aceder à BD em Azure:
from pyodbc import connect, drivers

# Para azure function functionar:
import azure.functions as func

# Comentei porque não posso usar conexão direta em Consumption Based plans sem abrir o key vault para o público, o que não quero fazer
# por questões de segurança. Assim sendo, tive que usar outra forma de sacar os secrets.
#from azure.keyvault.secrets import SecretClient
#from azure.identity import ManagedIdentityCredential

# Esta função corre de x em x tempo (de acordo com o ncrontab definido em function.json). Como interpretar ncrontab 
# aqui: https://ncrontab.swimburger.net/
def main(mytimer: func.TimerRequest) -> None:
# def main() -> None:

    # Lógica do processo para Gateway:
    # 1 - Vamos ao FTP à pasta /footfall-download/dados_contadores_silvano e lemos todos os ficheiros .csv que acabem em _data.csv
    # 2 - O ficheiro segue sempre a lógica xxxxxx_hostname_data.csv. Exemplo para Optivisao Aveiro: 000059_OptivisaoAveiro_data.csv
    # 3 - Deste modo, vamos ficheiro a ficheiro, sacamos o hostname com base no nome do ficheiro e guardamos como uma coluna da tabela
    #  final em Azure e no csv no FTP. Colunas da tabela final: hostname, id_loja, record_id, data_inicio_contagem, data_fim_contagem, segundos_contados, status_mess, 
    # num_pessoas_in, num_pessoas_out e datetime_insert_azure
    # 4 - Pegar nessa tabela do ponto 3 e incrementar numa tabela da BE em Azure e incrementar para dentro de um csv dentro do FTP (pasta 
    # /footfall-download/dados_contadores_silvano_historico).


    # Comentei porque não posso usar conexão direta em Consumption Based plans sem abrir o key vault para o público, o que não quero fazer
    # por questões de segurança. Assim sendo, tive que usar outra forma de sacar os secrets.
    """
    key_vault_uri = "https://contadores-project.vault.azure.net/"
    logging.info("passou key vault URI")
    managed_identity_credential = ManagedIdentityCredential()
    logging.info("passou mang identity")
    secret_client = SecretClient(vault_url=key_vault_uri, credential=managed_identity_credential)
    logging.info("passou secret client")
    server_print = secret_client.get_secret("server-name").value

    logging.info("server = " + server_print)
    
    logging.info("test 2")
    return None
    """

    # Função que pega num documento xml depois do parse() e devolve uma lista de atributos cosoante
    # a tage e o attribute name passado: 
    def get_element_attribute(document, tag_name, attribute_name):
        element_list2 = document.getElementsByTagName(tag_name)
        elements_ret = []
        for element2 in element_list2:
            # element2 = element_list2[0]
            element2_attributes = dict(element2.attributes.items())
            #print(element2_attributes[attribute_name])
            elements_ret.append(element2_attributes[attribute_name])

        return elements_ret


    # Função que pega numa data e subtrai segundos e retorna nova data:
    def get_datetime_str(datetime_str, datetime_format, seconds_to_subtract):
        date = datetime.datetime.strptime(datetime_str, datetime_format)
        new_date = date - datetime.timedelta(seconds=seconds_to_subtract)

        # retornar datetime como string:
        return new_date.strftime(datetime_format)
    
    # Data a usar para depois meter na tabela em azure:
    var_datetime_insert_azure = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")

    ############################# 1 - Ligar-me ao FTP para ver se há ficheiros novos:  #################################################
    # Dados para FTP:
    url = getenv("ftp_url")
    username_ftp = getenv("ftp_username")
    password_ftp = getenv("ftp_password") 

    # Ligar-me ao FTP:
    ftp_server = ftplib.FTP()
    # To perform tests if failed:
    #ftp_server.set_debuglevel(2)
    ftp_server.connect(url, 21, timeout=90)  # timeout de 90 segundos para não termos ligação ao ftp_server removida tão rapidamente.
    ftp_server.login(username_ftp, password_ftp)

    # Mudar para pasta onde estão as os ficheiros:
    folder_files = "/footfall-download/dados_contadores_silvano"
    ftp_server.cwd(folder_files)
    
    # Listar todos os ficheiros na pasta
    files_list = ftp_server.nlst()


    # Função onde passamos um regex e uma lista de nomes e ele fintra:
    def filter_names(regex_use, files_list):
        files_use = [re.search(regex_use, x).group(0) for x in files_list if re.search(regex_use, x)]
        return files_use

    # Filtar só pelos ficheiros que cumprem a lógica explicada no ponto 2:
    regex_hella = "^\\d{6}_.+_data.csv$"  # ^ no ínicio e $ no fim é para garantir match exato do seguinte formato: [6 digitos]_[conjunto qualquer de char ou digitos]_data.csv

    files_use_hella = filter_names(regex_use=regex_hella, files_list=files_list)

    # Tyco simplesmente acaba em .dat:    
    files_use_tyco = [x for x in files_list if x.endswith('.dat')]

    # concatenar as duas listas:
    files_use = files_use_hella + files_use_tyco

    # Criar df vazio que vai ser preenchido com dados dos ficheiros na pasta:
    df_contadores = pd.DataFrame()

    # ir um a um, ler os ficheiros e gravar num DF:
    for file_name in files_use:
        #print(file_name)
        #file_name = files_use[4]

        # Preparar BytesIO para ler o ficheiro remoto:
        flo = io.BytesIO()
        ftp_server.retrbinary('RETR ' + file_name, flo.write)
        flo.seek(0)
        
        # Init do df que será usado para trabalhar os dados:
        csv_contador_df = pd.DataFrame()

        # Origem dos dados
        origem_dados = ""

        # Caso seja csv (Hella), basta ler o csv:
        if ".csv" in file_name:
            # Agora podemos ler o csv:
            csv_contador_df = pd.read_csv(flo, encoding="latin1")

            origem_dados = "HL"

        # Caso contrário será um xml da Tyco:
        else: 

            origem_dados = "AX"
            # Criar exatamente a mesma estrutura de tabela que o pd.read_csv() acima lê da Hella. Assim,
            # todo o código abaixo que processa dados da Hella funcionará sem alterações:
            # "record_id","timestamp","period","status","0027-OptivisaoAveiro_SUM_IN","0027-OptivisaoAveiro_SUM_OUT"
            # 739,2023-11-11 11:15:00,900,"0",0,0
            
            # Caso queira confirmar que .dat parece ter xml dentro:
            #if "<?xml" not in str(flo.getvalue()):

            # Pegar no documento xml para trabalhar:
            document = parse(flo)

            # Record id não existe na Tyco, então vou deixar 0 por defeito:
            record_id = 0

            # Para coluna timestamp:
            date_rec = get_element_attribute(document, "Report", "Date")[0]
            end_time_l = get_element_attribute(document, "Count", "EndTime")

            timestamp_list = []
            for end_time in end_time_l:
                 timestamp = date_rec + " " + end_time
                 timestamp_list.append(timestamp)

            # Para ter coluna period:
            format = "%H:%M:%S"
            end_times = [datetime.datetime.strptime(x, format) for x in end_time_l]
            start_time_l = get_element_attribute(document, "Count", "StartTime")
            start_times = [datetime.datetime.strptime(x, format) for x in start_time_l]

            period_l = []
            for ind in range(0, len(end_times)):
                 time_diff = (end_times[ind] - start_times[ind]).seconds
                 period_l.append(time_diff)

            # Para o status:
            status_l = get_element_attribute(document, "Count", "Status")

            # Para o _SUM_IN:
            sum_in_l = get_element_attribute(document, "Count", "Enters")
            sum_out_l = get_element_attribute(document, "Count", "Exits")

            # Preciso do id da loja + "-" + nome da loja:
            site_id = get_element_attribute(document, "Metrics", "SiteId")[0]
            site_name = get_element_attribute(document, "Metrics", "Sitename")[0]
            colname_counts = site_id + "-" + site_name

            # Agora que tenho as variáveis todas prontas, posso criar o df:
            dict_for_df = {'record_id': record_id, 'timestamp': timestamp_list, 'period': period_l
                           , 'status': status_l, colname_counts + '_SUM_IN': sum_in_l
                           , colname_counts + '_SUM_OUT': sum_out_l}
            # Criar df final que simula formato do csv lido nos contadores da marca Hella:
            csv_contador_df = pd.DataFrame(dict_for_df)

        # Por vezes o ficheiro pode ter 0 linhas (ex: reiniciamos o contador e, dependendo da hora, ele 
        # devolve uma tabela vazia). Nestes casos, ignoramos tudo e saltamos para o próximo ficheiro:
        if len(csv_contador_df) < 1:
             # saltar para próxima iteration do loop:
             continue

        # Listar colunas e ficar com coluna que tenha "_SUM_IN" no nome:
        colum_list = [x.replace("_SUM_IN", "") for x in list(csv_contador_df.columns) if "_SUM_IN" in x]

        # Caso lista não retorne nada:
        if len(colum_list) < 1:
            raise ValueError('Parece que nao existe mais uma coluna com _SUM_IN no nome para sacarmos o counting_lines_name atraves do csv contador.')

        # Ficar com counting_lines_name:
        counting_lines_name = colum_list[0]

        # Criar coluna counting_lines_name:
        csv_contador_df.insert(loc = 0,column = "counting_lines_name", value = counting_lines_name)

        # Ficar com id da loja para depois criar coluna id_loja:
        id_loja_aux = colum_list[0].split("-")[0]
        # Tentar converter para int e, caso dê erro, continua como None:
        id_loja = "NULL"  # é assim que o SQL server está à espera, porque depois na query o NULL vai sem aspas.
        try:
             id_loja = int(id_loja_aux)
        except ValueError:
             pass
        
        codigo_loja = "NULL"
        flag_piso_alternativo = "0"
        try:
            if (id_loja == 1006):
                codigo_loja = id_loja
            else:
                # codigo_loja = str(id_loja)[len(str(id_loja))-3:] if len(str(id_loja))==4 else id_loja
                # flag_piso_alternativo = str(id_loja)[0] if len(str(id_loja))==4 else 0
                codigo_loja = str(id_loja)[len(str(id_loja))-3:] if len(str(id_loja))==4 else id_loja
                flag_piso_alternativo = 1 if len(str(id_loja))==4 else 0
        except ValueError:
            pass


        # Criar coluna id_loja:
        csv_contador_df.insert(loc = 1,column = "id_loja", value = id_loja)

        # Criar coluna codigo_loja
        csv_contador_df.insert(loc = 1,column = "codigo_loja", value = codigo_loja)

        # Criar coluna flag_piso_alternativo
        csv_contador_df.insert(loc = 1,column = "flag_piso_alternativo", value = flag_piso_alternativo)

        # Origem do contador
        csv_contador_df.insert(loc = 1,column = "origem", value = origem_dados)
        
        # Criar coluna com data de início da contagem:
        csv_contador_df['data_inicio_contagem'] = csv_contador_df.apply(lambda x: get_datetime_str(x['timestamp'], "%Y-%m-%d %H:%M:%S",  x['period']), axis=1)

        # Mudar nome das colunas com contagens:
        novos_nomes_col = {'timestamp': 'data_fim_contagem', 'period': 'segundos_contados', 'status': 'status_mess',
            counting_lines_name + '_SUM_IN': 'num_pessoas_in', counting_lines_name + '_SUM_OUT': 'num_pessoas_out'}
 
        # Mudar nomes:
        csv_contador_df.rename(columns=novos_nomes_col, inplace=True)

        # Reordenar nomes:
        nomes_ordem = ["counting_lines_name", "id_loja", "codigo_loja", "flag_piso_alternativo", "origem", "record_id", "data_inicio_contagem", "data_fim_contagem", "segundos_contados", "status_mess", "num_pessoas_in", "num_pessoas_out"]
        csv_contador_df = csv_contador_df[nomes_ordem]

        # Concatenar com valores sacados anteriormente:
        df_contadores = pd.concat([df_contadores, csv_contador_df])


    # FIM DO FOR.

    # fechar FTP e depois abro novamente (para não dar connection reset/timeout):
    ftp_server.quit()

    # Caso pasta estava vazia: 
    if len(df_contadores) < 1:
        logging.info("Nao havia nenhum ficheiro na pasta dos contadores que cumprisse as regras esperadas.")

        return None
    # Continua caso pasta não estava vazia:

    # Não deve haver duplicados, mas remover por precaução:
    df_contadores.drop_duplicates(keep="last", inplace=True)

    # Adicionar coluna com datetime run para sabermos:
    df_contadores.insert(loc = len(df_contadores.columns), column = "datetime_insert_azure", value = var_datetime_insert_azure)

    # Gravar dados na BD:
    # Dados para BD:
    #FALTA: METER TUDO O QUE SÃO DADOS SENSÍVEIS NUMA KEY VAULT E CHAMA-LAS NA FUNCTION APP PARA IREM COMO ENV VARIABLES (ÚNICA FORMA)

    # Exemplo do key vault + azure function aqui (a partir do ponto 2.): 
    # https://servian.dev/accessing-azure-key-vault-from-python-functions-44d548b49b37 (nota: tive que ir ao Networking da function app e
    # copiar o Inbound addresses e colar como IP seguro no Networking do Key Vault. Só assim a Function app consegue aceder aos secrets
    # sem termos que abrir a porta do key Vault ao público)
    server = getenv("db_server_name")
    database = getenv("database")
    username = getenv("db_username")
    password = getenv("db_password")
    #driver = 'ODBC Driver 17 for SQL Server'

    #logging.info("server: " + server)
    #logging.info("username: " + username)
    #logging.info("db: " + database)

    # Ver que drivers pyodbc no python tem disponíveis para usar:
    #drivers()
    #logging.info("DRIVERS: " + str(drivers()))
    
    # Para funcionar no meu Windows, tive que instalar o ODBC driver 18: 
    # https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver16
    # con_str="{ODBC Driver 18 for SQL Server};Server=tcp:{server},1433;Database={database};Uid={username};Pwd={password};Encrypt=yes;TrustServerCertificate=yes;Connection Timeout=30;"
    # Assim funcionou. Vi exemplo aqui: https://learn.microsoft.com/en-us/sql/connect/python/pyodbc/step-3-proof-of-concept-connecting-to-sql-using-pyodbc?view=sql-server-ver15
    con_str=f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER=tcp:{server},1433;DATABASE={database};UID={username};PWD={password}'

    # con_str = (
    #     r'Driver=SQL Server;'
    #     r'Server=.\SQLEXPRESS;'
    #     r'Database=azsqldb-bv-datawarehouse-dev;'
    #     r'Trusted_Connection=yes;'
    #     )
    
    # Ligar-me à BD:
    conn = connect(con_str)
    # Iniciar cursor:
    cursor = conn.cursor()

    # Executar query que insere dataframe no Synapse:
    for index, row in df_contadores.iterrows():
        #print(row.id_loja)
        #df_contadores = df_contadores.iloc[[0, -1]]

        # Fazer UPSERT, ou seja, caso já exista um hostname e data_fim_contagem iguais em Azure, ele faz update ao invés de inserir um 
        # duplicado. Caso não exista este hostname e data_fim_contagem, então inserimos uma linha nova na BD.
        # Nota importante: decidi usar o counting_lines_name como ID e não o id_loja porque o id_loja é parte do counting_lines_name
        # e pode ser null (caso alguém se esqueça de colocar o nome da loja no início do counting_lines_name). Logo, não me faz sentido
        # bloquear todo o processo porque uma loja tem id_lojs null. Se isso acontecer, a loja simplesmente fica sem contagens (caso 
        # agreguemos por id_loja), e alguém facilmente vai "sentir falta" desse loja e podem corrigir no backend do contador.
        string = """
            MERGE INTO [dbo].[FT_MD_Visitantes_v4] t
            USING (VALUES ('%(counting_lines_name)s', %(id_loja)s, %(record_id)s, '%(data_inicio_contagem)s', '%(data_fim_contagem)s', %(segundos_contados)s, '%(status_mess)s', %(num_pessoas_in)s, %(num_pessoas_out)s, '%(datetime_insert_azure)s', %(codigo_loja)s, '%(flag_piso_alternativo)s', '%(origem)s')) AS v (counting_lines_name,id_loja,record_id,data_inicio_contagem, data_fim_contagem, segundos_contados, status_mess, num_pessoas_in, num_pessoas_out, datetime_insert_azure, codigo_loja, flag_piso_alternativo, origem)
            ON t.counting_lines_name = v.counting_lines_name AND t.data_fim_contagem = v.data_fim_contagem
            -- Replace when the key exists
            WHEN MATCHED THEN
                UPDATE SET
                    t.id_loja = v.id_loja,
                    t.record_id = v.record_id,
                    t.data_inicio_contagem = v.data_inicio_contagem,
                    t.segundos_contados = v.segundos_contados,
                    t.status_mess = v.status_mess,
                    t.num_pessoas_in = v.num_pessoas_in,
                    t.num_pessoas_out = v.num_pessoas_out,
                    t.datetime_insert_azure = v.datetime_insert_azure,
                    t.codigo_loja = v.codigo_loja,
                    t.flag_piso_alternativo = v.flag_piso_alternativo,
                    t.origem = v.origem
            -- Insert new keys
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (counting_lines_name,id_loja,record_id,data_inicio_contagem, data_fim_contagem, segundos_contados, status_mess, num_pessoas_in, num_pessoas_out, datetime_insert_azure, codigo_loja, flag_piso_alternativo, origem)
                VALUES (v.counting_lines_name,v.id_loja,v.record_id,v.data_inicio_contagem, v.data_fim_contagem, v.segundos_contados, v.status_mess, v.num_pessoas_in, v.num_pessoas_out, v.datetime_insert_azure, v.codigo_loja, v.flag_piso_alternativo, v.origem)
            ;

            """ % {"counting_lines_name": row.counting_lines_name, 
                   "id_loja": row.id_loja, 
                   "record_id": row.record_id, 
                   "data_inicio_contagem": datetime.datetime.strptime(row.data_inicio_contagem, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%dT%H:%M:%S'), 
                   "data_fim_contagem": datetime.datetime.strptime(row.data_fim_contagem, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%dT%H:%M:%S'), 
                   "segundos_contados": row.segundos_contados, 
                   "status_mess": row.status_mess, 
                   "num_pessoas_in": row.num_pessoas_in, 
                   "num_pessoas_out": row.num_pessoas_out, 
                   "datetime_insert_azure": datetime.datetime.strptime(row.datetime_insert_azure, '%Y-%m-%dT%H:%M:%S.%f').strftime('%Y-%m-%dT%H:%M:%S'), 
                   "codigo_loja":row.codigo_loja, 
                   "flag_piso_alternativo": row.flag_piso_alternativo, 
                   "origem" : row.origem}
        
        cursor.execute(string)

        # Insert simples:
        #cursor.execute("INSERT INTO [dbo].[FT_MD_Visitantes_v2] (hostname,record_id,data_fim_contagem,segundos_contados,status_mess,num_pessoas_in,num_pessoas_out,datetime_insert_azure) values(?,?,?,?,?,?,?,?)", row.hostname, row.record_id, datetime.datetime.strptime(row.data_fim_contagem, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%dT%H:%M:%S'), row.segundos_contados, row.status_mess, row.num_pessoas_in, row.num_pessoas_out, datetime.datetime.strptime(row.datetime_insert_azure, '%Y-%m-%dT%H:%M:%S.%f'))

    # Fechar ligações à query e ao cursor:
    conn.commit()  # só após o commit é que os dados vão efetivamente para a BD. 
    cursor.close()


    # Ligar-me ao FTP novamente:
    ftp_server = ftplib.FTP()
    ftp_server.connect(url, 21, timeout=90)  # timeout de 90 segundos para não termos ligação ao ftp_server removida tão rapidamente.
    ftp_server.login(username_ftp, password_ftp)

    # Mudar para pasta onde estão as os ficheiros:
    #folder_files = "/footfall-download/dados_contadores_silvano"
    ftp_server.cwd(folder_files)

    # Mover para a pasta de histórico os ficheiros processados:
    for file_name in files_use:
        #file_name = files_use[0]
        try:
            new_file_path = "/footfall-download/dados_contadores_silvano_historico" + "/" + file_name
            ftp_server.rename(file_name, new_file_path)
        # Caso dê erro porque já existe ficheiro com mesmo nome no histórico, apagamos e passamos o ficheiro mais recente:
        except ftplib.error_perm as e:
            if "550 Cannot create a file when that file already exists." in str(e):
                ftp_server.delete(new_file_path)
                ftp_server.rename(file_name, new_file_path)
            # Não devia acontecer, mas caso aconteça, metemos o outro tipo de erro no log para analisar:
            else:
                logging.info("Erro com o FTP ao tentar mover o ficheiro " + file_name + ": " + str(e))
                

    # # Fechar ligação ao FTP:
    # ftp_server.quit()

    # Info para logs da Azure function:
    logging.info("Fim. " + str (len(files_use)) + " ficheiros processados com sucesso. Ultimo ficheiro processado: " + files_use[-1])

    # FIM DO PROCESSO:
    return None  


# if __name__ == "__main__":     
#     main()

# Apenas para FYI:

# Nota:
# Query que corri na BD para criar tabela a ser populada em Azure:
"""
/*SÓ É PRECISO CRIAR UMA VEZ: */
CREATE TABLE [dbo].[FT_MD_Visitantes_v2]
(
    hostname VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    data_inicio_contagem DATETIME NOT NULL,
    data_fim_contagem DATETIME NOT NULL,
    segundos_contados INT NOT NULL,
    status_mess VARCHAR(50) NOT NULL,
    num_pessoas_in INT NOT NULL,
	num_pessoas_out INT NOT NULL,
	datetime_insert_azure DATETIME NOT NULL
)
GO

CREATE TABLE [dbo].[FT_MD_Visitantes_v3]
(
    counting_lines_name VARCHAR(100) NOT NULL,
	id_loja INT NULL,
    record_id INT NOT NULL,
    data_inicio_contagem DATETIME NOT NULL,
    data_fim_contagem DATETIME NOT NULL,
    segundos_contados INT NOT NULL,
    status_mess VARCHAR(50) NOT NULL,
    num_pessoas_in INT NOT NULL,
	num_pessoas_out INT NOT NULL,
	datetime_insert_azure DATETIME NOT NULL
)
GO
"""

"""
/*Exemplo de UPSERT em SQL Server Azure:*/
MERGE INTO [dbo].[FT_MD_Visitantes_v2] t
USING (VALUES ('aa', 1000, '2023-11-03T19:45:00', 900, 'status novo 2', 102, 9, '2023-11-03T20:45:00')) AS v (hostname,record_id,data_inicio_contagem, data_fim_contagem, segundos_contados, status_mess, num_pessoas_in, num_pessoas_out, datetime_insert_azure)
ON t.hostname = v.hostname AND t.data_fim_contagem = v.data_fim_contagem
-- Replace when the key exists
WHEN MATCHED THEN
    UPDATE SET
		t.record_id = v.record_id,
        t.data_inicio_contagem = v.data_inicio_contagem,
		t.segundos_contados = v.segundos_contados,
        t.status_mess = v.status_mess,
		t.num_pessoas_in = v.num_pessoas_in,
        t.num_pessoas_out = v.num_pessoas_out,
		t.datetime_insert_azure = v.datetime_insert_azure
-- Insert new keys
WHEN NOT MATCHED BY TARGET THEN
    INSERT (hostname,record_id,data_inicio_contagem, data_fim_contagem, segundos_contados, status_mess, num_pessoas_in, num_pessoas_out, datetime_insert_azure)
    VALUES (v.hostname,v.record_id,v.data_inicio_contagem, v.data_fim_contagem, v.segundos_contados, v.status_mess, v.num_pessoas_in, v.num_pessoas_out, v.datetime_insert_azure)
;
"""

"""
CREATE TABLE [dbo].[FT_MD_Visitantes_v4] (
	"counting_lines_name" VARCHAR(100) NOT NULL,
	"id_loja" INT NULL DEFAULT 'NULL',
	"record_id" INT NOT NULL,
	"data_inicio_contagem" DATETIME NOT NULL,
	"data_fim_contagem" DATETIME NOT NULL,
	"segundos_contados" INT NOT NULL,
	"status_mess" VARCHAR(50) NOT NULL COLLATE,
	"num_pessoas_in" INT NOT NULL,
	"num_pessoas_out" INT NOT NULL,
	"datetime_insert_azure" DATETIME NOT NULL,
	"codigo_loja" INT NULL,
	"flag_piso_alternativo" INT NULL,
	"origem" VARCHAR(2) NULL 
)
GO
"""

"""
CREATE VIEW dbo.view_visitantes_v4 AS
SELECT
	 tb.id_loja	
	, CAST(FORMAT(CAST(tb.data_inicio_contagem AS date), 'yyyMMdd') AS VARCHAR) AS data	
	, FORMAT(DATEADD(hour, DATEPART(hour, tb.data_inicio_contagem), '00:00:00'), 'HH') AS hora_visita	
	, CASE
		WHEN SUM(tb.flag_piso_alternativo) > 0 THEN 1
		ELSE 0
	END AS flag_piso_alternativo
	, SUM(CAST(tb.status_mess AS INT)) AS status_mess
	, SUM(CAST(tb.num_pessoas_in AS INT)) AS contador_visitas_semanal 
	, SUM(CAST(tb.num_pessoas_out AS INT)) AS num_pessoas_out 
	, CAST(tb.datetime_insert_azure AS date) AS data_criacao
FROM dbo.FT_MD_Visitantes_v4 tb
GROUP BY 
	 CAST(tb.data_inicio_contagem AS date)
	, DATEPART(hour, tb.data_inicio_contagem)
	, CAST(tb.datetime_insert_azure AS date)
	, tb.flag_piso_alternativo
	, tb.id_loja
"""

"""
CREATE VIEW dbo.vw_visitantes_v3 AS
SELECT
	 tb.id_loja	
	, CAST(FORMAT(CAST(tb.data_inicio_contagem AS date), 'yyyMMdd') AS VARCHAR) AS data	
	, FORMAT(DATEADD(hour, DATEPART(hour, tb.data_inicio_contagem), '00:00:00'), 'HH') AS hora_visita	
	, CASE
		WHEN LEN(tb.id_loja) > 3 THEN 1
		ELSE 0
	END AS flag_piso_alternativo
	, SUM(CAST(tb.status_mess AS INT)) AS status_mess
	, SUM(CAST(tb.num_pessoas_in AS INT)) AS contador_visitas_semanal 
	, SUM(CAST(tb.num_pessoas_out AS INT)) AS num_pessoas_out 
	, CAST(tb.datetime_insert_azure AS date) AS data_criacao

FROM dbo.FT_MD_Visitantes_v3 tb
GROUP BY 
	 CAST(tb.data_inicio_contagem AS date)
	, DATEPART(hour, tb.data_inicio_contagem)
	, CAST(tb.datetime_insert_azure AS date)
	, tb.id_loja;
"""

"""
UPDATE dbo.FT_MD_Visitantes_v3 SET codigo_loja = case when len(id_loja) = 4 THEN SUBSTRING(CAST(id_loja AS VARCHAR), 2,4) ELSE id_loja END;

UPDATE dbo.FT_MD_Visitantes_v3 SET codigo_loja = 1006 WHERE id_loja = 1006;
"""