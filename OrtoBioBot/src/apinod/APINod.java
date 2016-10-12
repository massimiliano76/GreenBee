package apinod;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;

import com.botticelli.bot.request.methods.types.GsonOwner;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import oggettijson.ItemMag;
import oggettijson.Punti;
import oggettijson.RichiestaTransazione;
import oggettijson.Transazione;

public class APINod {

	// Type founderListType = new TypeToken<ArrayList<Founder>>(){}.getType();

	private static APINod mySelf;
	private String OK = "\"OK\"";
	private Gson gson;
	// private String ip = "http://192.168.15.69";
	private String ip = "http://greenbeemfr.herokuapp.com";
	// private String porta = ":3000";
	private String porta = ":80";
	private String sitoBase;
	private String apiBase = "/rest-api/utenteTelegram/";
	private String apiMagazzino = "/rest-api/Magazzino/";

	private String isNellOrto = "isNellOrto/";
	private String addIngresso = "addIngresso/";
	private String addUscita = "addUscita/";
	private String addTransazione = "addTransazione/";
	private String getPunti ="getPunti/";
	private String listTransazioni = "listTransazioni/";
	private String urlIsNellOrto;
	private String urlAddIngresso;
	private String urlAddUscita;
	private String urlMagazzino;
	private String urlPunti;
	private String urlTransazione;
	private String urlListTransazione;
	
	private ChiamatoreAPI API;

	private APINod() {
		gson = GsonOwner.getInstance().getGson();
		sitoBase = ip + porta + apiBase;
		urlIsNellOrto = sitoBase + isNellOrto;
		urlAddIngresso = sitoBase + addIngresso;
		urlAddUscita = sitoBase + addUscita;
		urlMagazzino = ip + porta + apiMagazzino;
		urlPunti = sitoBase + getPunti;
		urlTransazione = sitoBase + addTransazione;
		urlListTransazione = sitoBase + listTransazioni;
		API = new ChiamatoreAPI();
		
	}

	public static APINod getIstance()
	{
		if(mySelf == null)
			mySelf = new APINod();
		return mySelf;
	}
	
	public boolean isNellOrto(long id) {
		return API.getAlServer(urlIsNellOrto + String.valueOf(id)).equals("true");
	}

	public boolean addIngresso(long id) {
		return API.putAlServer(urlAddIngresso + String.valueOf(id)).equals(OK);
	}

	public boolean addUscita(long id) {
		return API.putAlServer(urlAddUscita + String.valueOf(id)).equals(OK);
	}

	public List<ItemMag> getMagazzino() {
		String json = API.getAlServer(urlMagazzino);
		return gson.fromJson(json, new TypeToken<ArrayList<ItemMag>>() {
		}.getType());
	}

	public List<Transazione> getStorico(long id) {
		String json = API.getAlServer(urlListTransazione + String.valueOf(id));
		return gson.fromJson(json, new TypeToken<ArrayList<Transazione>>() {
		}.getType());
	}
	
	public synchronized File saveImage(String urlIMG) {

		try {
			URL u = new URL(ip + urlIMG);
			File f = new File(urlIMG.substring(12));
			FileUtils.copyURLToFile(u, f);
			return f;
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public Transazione addTransazione(long id, RichiestaTransazione rt)
	{
		String json = API.putAlServer(urlTransazione + String.valueOf(id), gson.toJson(rt));
		return gson.fromJson(json, Transazione.class);
	}
	
	public Punti getPunti(long id)
	{
		return gson.fromJson(API.getAlServer(urlPunti + String.valueOf(id)), Punti.class);
	}
}
