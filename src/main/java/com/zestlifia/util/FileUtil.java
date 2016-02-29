package com.zestlifia.util;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;

/**
 * Created by jackho on 2/29/16.
 */
public class FileUtil {

    private static final String BASE_DIR = System.getProperties().get("user.dir").toString();
    private static final String SEPARATOR = File.separator;
    private static final String DATA_DIR = BASE_DIR + SEPARATOR + "src" + SEPARATOR + "main" + SEPARATOR + "webapp" + SEPARATOR + "WEB-INF" + SEPARATOR + "app"+ SEPARATOR +"backoffice" + SEPARATOR + "rest" + SEPARATOR;



    public static JSONObject getRest(String fileName) {

        String sitesPathDir = DATA_DIR+fileName+SEPARATOR;
        String sitesPath = sitesPathDir+"GET";
        return FileUtil.getJsonObject(sitesPath);

    }

    public static JSONObject getJsonObject(String path) {
        JSONParser parser = new JSONParser();

        Object objSites = null;
        try {
            objSites = parser.parse(new FileReader(path));
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        JSONObject jsonObject = (JSONObject) objSites;

        System.out.println(jsonObject);

        return jsonObject ;
    }
}
