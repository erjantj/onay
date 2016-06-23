<?
	require_once('simple_html_dom.php');
	// 9643108503302314325
	function httpPost($url, $data)
	{
	    $curl = curl_init($url);
	    curl_setopt($curl, CURLOPT_POST, true);
	    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	    $response = curl_exec($curl);
	    curl_close($curl);
	    return $response;
	}

	function getCsrf()
	{
		$html = file_get_html('https://cabinet.onay.kz/');
		$csrf = $html->find('#csrftoken', 0)->value;
		return $csrf;
	}

	if (isset($_GET['pan']) && is_numeric($_GET['pan']) && strlen($_GET['pan']) == 19)
	{
		$pan = $_GET['pan'];
		$csrf = getCsrf();
		$response = json_decode(httpPost('https://cabinet.onay.kz/check', array(
			'pan' => $pan,
			'csrf' => $csrf
		)), true);
		if (isset($response['result'])) 
		{
			header('Access-Control-Allow-Origin: *');  
			header('Content-Type: application/json');
			echo json_encode($response['result']);
			exit();
		}
	}
	else
	{
		header('HTTP/1.0 404 Not Found');
		echo "<h1>404 Not Found</h1>";
		echo "The page that you have requested could not be found.";		
		exit();
	}
?>