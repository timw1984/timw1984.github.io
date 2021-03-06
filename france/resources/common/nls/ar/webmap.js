﻿define(
	 ({
		commonWebmap: {
			selector: {
				lblWebMap: "خريطة",
				lblLocation: "الموقع",
				lblContent: "المحتوى",
				lblPopup: "العنصر المنبثق",
				lblControls: "التطبيقات الإضافية",
				lblOverview: "خريطة النظرة العامة",
				lblLegend: "مفتاح الخريطة",
				lblGeocoder: "الباحث عن العنوان أو المكان",
				tooltipGeocoder: "السماح للمستخدمين بالعثور على العناوين والأماكن على الخريطة.",
				loadingTitle: "تحميل العنوان",
				entry: "إدخال",
				entries: "إدخالات",
				section: "الجزء",
				sections: "الأجزاء",
				and: "و",
				action: "إجراءات المقطع",
				actions: "إجراءات المقاطع",
				originalWebmap: "الخريطة المستخدمة لنشر %TPL_NAME%",
				browseMaps: "تحديد خريطة",
				createMap: "خريطة.",
				current: "الخريطة الحالية",
				select: "حدد أو أنشئ خريطة",
				newMap: "خريطة محددة مُؤخرًا",
				newCreatedMap: "خريطة تم إنشاؤها مُؤخرًا",
				webmapDefault: "الوضع الافتراضي للخريطة",
				customCfg: "التكوين المخصص",
				tooltipLocation: "تعريف الموقع الذي ستعرضه هذه الخريطة.",
				tooltipContent: "تعريف الطبقات المرئية.",
				tooltipPopup: "اختر عنصرًا منبثقًا سيُفتح عند عرض الخريطة.",
				tooltipOverview: "عرض خريطة نظرة عامة صغيرة مع الخريطة الأساسية",
				tooltipLegend: "عرض وسيلة إيضاح الخريطة على الخريطة وتكون مفيدة عند حصول الخريطة على العديد من الطبقات والرموز.",
				mapCfgInvite: "استخدم عناصر التحكم الحالية لتكوين الخريطة",
				lblLocationAlt: "موروث من الخريطة الأولى",
				tooltipLocationAlt: "يتم تزامن موقع الخريطة للخريطة الأولى في السلسلة، ولتغيير هذا السلوك في السلسلة، انتقل إلى إعدادات > خيارات الخريطة."
			},
			configure: {
				btnReset: "إعادة تعيين",
				btnCancel: "إلغاء الأمر",
				tocTitle: "محتويات الخريطة",
				tocExplain: "تحديد اي الطبقات سيتم إظهارها.",
				tocNoData: "يتعذر تكوين طبقة.",
				tocSave: "احفظ محتويات الخريطة",
				extentTitle: "موقع الخريطة",
				extentExplain: "تحريك الخريطة وتكبيرها لتحديد كيفية ظهورها للقراء.",
				extentSave: "حفظ موقع الخريطة",
				popupTitle: "عنصر الخريطة المنبثق",
				popupExplain: "انقر على أحد المعالم لفتح العنصر المنبثق الذي تريد عرضه.",
				popupSave: "احفظ تكوين العنصر المنبثق",
				hintNavigation: "انتقال الخريطة مُعطل."
			},
			editor: {
				loading: "يرجى الانتظار حتى تحميل مُحرر الخريطة",
				newTitle: "إنشاء خريطة جديدة",
				editTitle: "تحرير الخريطة",
				titleLbl: "العنوان",
				titlePh: "عنوان الخريطة...",
				folderLbl: "سيتم إنشاء الخريطة في نفس المجلد ليُمثل القصة.",
				creating: "إنشاء الخريطة",
				saving: "حفظ الخريطة",
				success: "تم حفظ الخريطة",
				successCreate: "تم إنشاء الخريطة",
				cancelTitle: "هل تريد تجاهل كل التغييرات التي لم يتم حفظها؟",
				errorDuplicate: "توجد خريطة تحمل ذلك العنوان بالفعل",
				errorCreate: "يتعذر إنشاء الخريطة. يرجى إعادة المحاولة.",
				errorSave: "يتعذر حفظ الخريطة. يرجى إعادة المحاولة.",
				notavailable1: "عذرًا، إنشاء الخريطة أو تحريرها غير مدعوم في Firefox بسبب قيود فنية. يمكنك إنشاء القصة باستخدام مستعرض ويب آخر أو استخدام الحل البديل التالي.",
				notavailable2: "عذرًا، إنشاء الخريطة أو تحريرها غير مدعوم نظرًا لعدم استضافة تطبيق خريطة القصة في %PRODUCT%. يرجى الاتصال بمسئول ArcGIS لمزيد من المعلومات.",
				notavailable3: "عذرًا، إنشاء الخريطة أو تحريرها غير مدعوم في هذا الإصدار من Portal for ArcGIS (يتطلب الإصدار 10.4 أو أحدث). يرجى الاتصال بمسئول ArcGIS لمزيد من المعلومات.",
				notavailable4: "يمكنك إنشاء خريطة باستخدام %MV%، ثم الرجوع هنا لإضافتها إلى القصة.",
				notavailable5: "يمكنك تحرير الخريطة باستخدام %MV%، ثم الرجوع هنا و%apply% لرؤية التغييرات التي أجريتها.",
				notavailable6: "عارض الخرائط",
				notavailable7: "إعادة تحميل الخريطة"
			}
		},
		configure: {
			mapdlg:{
				items:{
					organizationLabel: "المؤسسة",
					onlineLabel: "ArcGIS Online",
					contentLabel: "المحتوى",
					favoritesLabel: "المفضلات"
				},
				title: "تحديد خريطة",
				searchTitle: "بحث",
				ok: "موافق",
				cancel: "إلغاء الأمر",
				placeholder: "أدخل مصطلح البحث أو مُعرّف خريطة الويب..."
			}
		}
	})
);
